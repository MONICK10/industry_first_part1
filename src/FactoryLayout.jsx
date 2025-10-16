import React, { useState, useEffect, useMemo } from "react";
import RegistrationModal from "./Registration";
import "./FactoryLayout.css";


// --- Data Structures ---
const initialWorkersDB = {
  101: { id: 101, name: "RAM", claimedSkills: ["Welding", "Assembly"], skillStatus: 'untrained' },
  102: { id: 102, name: "PRIYA", claimedSkills: ["Welding"], skillStatus: 'untrained' },
  103: { id: 103, name: "HARI", claimedSkills: ["Welding", "Quality"], skillStatus: 'untrained' },
  201: { id: 201, name: "ANNA", claimedSkills: ["Assembly"], skillStatus: 'untrained' },
  202: { id: 202, name: "BALA", claimedSkills: ["Assembly", "Packaging"], skillStatus: 'untrained' },
  203: { id: 203, name: "CARL", claimedSkills: ["Assembly"], skillStatus: 'untrained' },
  301: { id: 301, name: "DALWIN", claimedSkills: ["Painting"], skillStatus: 'untrained' },
  302: { id: 302, name: "SRI", claimedSkills: ["Painting", "Quality"], skillStatus: 'untrained' },
  303: { id: 303, name: "MAKESH", claimedSkills: ["Painting", "Welding"], skillStatus: 'untrained' },
  401: { id: 401, name: "DAVE", claimedSkills: ["Quality", "Packaging"], skillStatus: 'untrained' },
  402: { id: 402, name: "EVA", claimedSkills: ["Quality"], skillStatus: 'untrained' },
  403: { id: 403, name: "FRANK", claimedSkills: ["Quality", "Assembly"], skillStatus: 'untrained' },
  501: { id: 501, name: "GRACE", claimedSkills: ["Packaging"], skillStatus: 'untrained' },
  502: { id: 502, name: "HEIDI", claimedSkills: ["Packaging"], skillStatus: 'untrained' },
  503: { id: 503, name: "IVAN", claimedSkills: ["Packaging", "Assembly"], skillStatus: 'untrained' },
};

const sectionsData = [
  { id: 1, name: "Welding Section", dept: "Welding" },
  { id: 2, name: "Assembly Section", dept: "Assembly" },
  { id: 3, name: "Painting Section", dept: "Painting" },
  { id: 4, name: "Quality Inspection", dept: "Quality" },
  { id: 5, name: "Packaging Section", dept: "Packaging" },
];

const departmentOrder = ["Welding", "Assembly", "Painting", "Quality", "Packaging"];

// --- Child Components Defined ONCE at the top ---
const WorkingWorker = ({ worker, onTaskComplete }) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const actualTime = 4000 + Math.random() * 2000;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    onTaskComplete(worker);
                    return 100;
                }
                return prev + 5;
            });
        }, actualTime / 20);
        return () => clearInterval(interval);
    }, [worker, onTaskComplete]);

    return (
        <div className="assigned-worker skilled">
            <div className="worker-info">
                <div className="worker-name">{worker.name}</div>
                <div className="skill-status">Working...</div>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>
    );
};

const TrainingCenter = ({ worker, onTrainingComplete }) => {
    const [trainingState, setTrainingState] = useState({ currentSkillIndex: 0, times: {}, conclusion: null });
    const [progress, setProgress] = useState(0);
    const skillsToTrain = useMemo(() => worker ? worker.claimedSkills : [], [worker]);

    useEffect(() => {
        if (!worker || trainingState.conclusion) return;
        const currentSkill = skillsToTrain[trainingState.currentSkillIndex];
        if (!currentSkill) {
            setTrainingState(prev => ({ ...prev, conclusion: "Training Complete!" }));
            setTimeout(() => onTrainingComplete(worker), 2000);
            return;
        }
        const trainingTime = 2000 + Math.random() * 3000;
        const startTime = Date.now();
        setProgress(0);
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const currentProgress = Math.min((elapsedTime / trainingTime) * 100, 100);
            setProgress(currentProgress);
            if (currentProgress >= 100) {
                clearInterval(interval);
                setTrainingState(prev => ({ ...prev, currentSkillIndex: prev.currentSkillIndex + 1, times: { ...prev.times, [currentSkill]: trainingTime } }));
            }
        }, 50);
        return () => clearInterval(interval);
    }, [worker, trainingState, skillsToTrain, onTrainingComplete]);

    if (!worker) return null;

    return (
        <div className="training-center-wrapper">
            <h3>Training Center: {worker.name}</h3>
            <div className="training-modules">
                {skillsToTrain.map((skill) => {
                    const isDone = trainingState.times[skill];
                    const isCurrent = skillsToTrain[trainingState.currentSkillIndex] === skill && !isDone;
                    return (
                        <div key={skill} className={`training-module ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}>
                            <div className="module-name">{skill}</div>
                            <div className="module-progress-bar"><div className="module-progress-fill" style={{ width: isCurrent ? `${progress}%` : isDone ? '100%' : '0%' }} /></div>
                            <div className="module-time">{trainingState.times[skill] ? `${(trainingState.times[skill] / 1000).toFixed(1)}s` : '-'}</div>
                        </div>
                    );
                })}
            </div>
            {trainingState.conclusion && <div className="training-conclusion">{trainingState.conclusion}</div>}
        </div>
    );
};

// --- Main Factory Layout Component ---
export default function FactoryLayout() {
  const [carouselOpen, setCarouselOpen] = useState(true);
  const [workerDB, setWorkerDB] = useState(initialWorkersDB);
  const [assignedWorkers, setAssignedWorkers] = useState({});
  const [trainingWorker, setTrainingWorker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableWorkers = Object.values(workerDB).filter(w => 
      !Object.values(assignedWorkers).some(aw => aw.id === w.id) &&
      (!trainingWorker || trainingWorker.id !== w.id)
  );
  
  const workersByDept = availableWorkers.reduce((acc, worker) => {
      const displayDept = worker.claimedSkills[0] || 'Unassigned';
      acc[displayDept] = acc[displayDept] || [];
      acc[displayDept].push(worker);
      return acc;
  }, {});

  const handleRegisterWorker = (name, skillsArray) => {
    const newWorker = {
      id: Date.now(),
      name: name,
      claimedSkills: skillsArray,
      skillStatus: 'untrained',
    };
    setWorkerDB(prev => ({ ...prev, [newWorker.id]: newWorker }));
    setTrainingWorker(newWorker);
  };

  const handleTrainingComplete = (trainedWorker) => {
    setWorkerDB(prev => ({
        ...prev,
        [trainedWorker.id]: { ...prev[trainedWorker.id], skillStatus: 'trained' }
    }));
    setTrainingWorker(null);
    alert(`${trainedWorker.name} has completed training and is now available for work.`);
  };

  const handleDragStart = (e, worker) => {
    e.dataTransfer.setData("workerId", worker.id);
  };
  
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, sectionDept, machineId) => {
    e.preventDefault();
    const workerId = parseInt(e.dataTransfer.getData("workerId"));
    const workerFromDB = workerDB[workerId];

    if (assignedWorkers[machineId]) {
      alert("This machine is already busy.");
      return;
    }
    if (trainingWorker) {
      alert(`Cannot assign workers while ${trainingWorker.name} is in training.`);
      return;
    }
    
    if (workerFromDB.skillStatus === 'untrained') {
      alert(`${workerFromDB.name} must be trained first. Sending to training center.`);
      setTrainingWorker(workerFromDB);
      return;
    }

    if (!workerFromDB.claimedSkills.includes(sectionDept)) {
      alert(`${workerFromDB.name} is not skilled for the ${sectionDept} department.`);
      return;
    }

    setAssignedWorkers(prev => ({ ...prev, [machineId]: { ...workerFromDB, assignmentId: Date.now() }}));
  };

  const handleTaskComplete = (completedWorker) => {
    setTimeout(() => {
        const machineId = Object.keys(assignedWorkers).find(
            key => assignedWorkers[key]?.assignmentId === completedWorker.assignmentId
        );
        setAssignedWorkers(prev => {
            const newState = {...prev};
            delete newState[machineId];
            return newState;
        });
    }, 1500);
  };

  return (
    <>
      {isModalOpen && <RegistrationModal onRegister={handleRegisterWorker} onClose={() => setIsModalOpen(false)} />}
      
      <div className="factory-container">
        <div className="top-right-controls">
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              + Register Worker
            </button>
        </div>

        <div className={`left-carousel ${carouselOpen ? "open" : ""}`}>
          <button className="carousel-btn" onClick={() => setCarouselOpen(!carouselOpen)}>
            {carouselOpen ? '<<' : '☰'}
          </button>
          <div className="carousel-content">
            <h3>Available Workers</h3>
            {departmentOrder.map(dept => (
              (workersByDept[dept] && workersByDept[dept].length > 0) && (
                <div key={dept} className="department-group">
                  <h4>{dept} Dept</h4>
                  {workersByDept[dept].sort((a,b) => a.id - b.id).map((w) => (
                    <div key={w.id} className="worker-box" draggable onDragStart={(e) => handleDragStart(e, w)} data-status={w.skillStatus}>
                      {w.name}
                      <div className="worker-skills">{w.claimedSkills.join(', ')}</div>
                      <div className="worker-status">{w.skillStatus}</div>
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
        </div>

        <div className="factory-map-viewport">
          <div className="factory-map-canvas">
              <TrainingCenter 
                key={trainingWorker ? trainingWorker.id : 'no-worker'} 
                worker={trainingWorker} 
                onTrainingComplete={handleTrainingComplete} 
              />
              {sectionsData.map((sec) => (
              <div key={sec.id} className="section-wrapper" id={`section-${sec.id}`}>
                  <h2>{sec.name}</h2>
                  <div className="machines-row">
                  {[1, 2, 3].map((m) => {
                      const machineId = `${sec.id}-${m}`;
                      const worker = assignedWorkers[machineId];
                      return (
                      <div className="machine-pod" key={machineId} onDrop={(e) => handleDrop(e, sec.dept, machineId)} onDragOver={handleDragOver}>
                          {worker && <WorkingWorker worker={worker} onTaskComplete={handleTaskComplete} />}
                          <div className={`machine-box ${worker ? 'vibrating' : ''}`}>
                          <div className="machine-icon"></div>
                          <div className="machine-label">{sec.dept} Machine {m}</div>
                          </div>
                      </div>
                      );
                  })}
                  </div>
              </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}