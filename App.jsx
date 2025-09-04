```jsx
import React, { useState, useEffect, useRef } from 'react';

const MedicalApp = () => {
  const [currentCategory, setCurrentCategory] = useState('emergencias');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [appHistory, setAppHistory] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState('procedures');
  const [theme, setTheme] = useState('light');
  const searchTimeout = useRef(null);

  // Mock medical data
  const medicalData = {
    emergencias: {
      title: "Emergencias Médicas",
      icon: "fa-ambulance",
      description: "Manejo de situaciones críticas y emergencias médicas",
      procedures: [
        {
          id: "iam",
          title: "Infarto Agudo de Miocardio",
          icon: "fa-heart-pulse",
          summary: "Manejo agudo del IAM con intervención coronaria percutánea de urgencia.",
          materials: ["ECG", "Aspirina", "Clopidogrel", "Heparina", "Morfina", "Oxígeno"],
          steps: [
            "Activación del código infarto",
            "ECG dentro de los primeros 10 minutos",
            "Confirmación diagnóstica con elevación del ST",
            "Establecer acceso venoso periférico",
            "Administrar aspirina 162-325 mg masticable",
            "Administrar clopidogrel 600 mg o ticagrelor 180 mg",
            "Administrar heparina no fraccionada",
            "Administrar analgesia (morfina)",
            "Oxigenoterapia si saturación <90%",
            "Intervención coronaria percutánea de urgencia"
          ],
          notes: "El tiempo es músculo. El objetivo es puerta-balón <90 minutos.",
          visualReferences: [
            {
              url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/STEMI_electrocardiogram.jpg/800px-STEMI_electrocardiogram.jpg",
              title: "ECG de IAMCEST",
              description: "Elevación del segmento ST en derivaciones precordiales"
            }
          ],
          source: {
            name: "AHA Guidelines",
            url: "https://www.heart.org/en/guidelines"
          },
          lastUpdated: "2023-09-15"
        },
        {
          id: "sepsis",
          title: "Sepsis y Shock Séptico",
          icon: "fa-bacteria",
          summary: "Reconocimiento y manejo temprano de la sepsis para reducir la mortalidad.",
          materials: ["Hemocultivos", "Antibióticos", "Fluidos", "Vasopresores", "Equipo de soporte"],
          steps: [
            "Identificación de criterios de SIRS",
            "Obtención de hemocultivos",
            "Administración de antibióticos empíricos en la primera hora",
            "Reanimación con fluidos cristaloides (30 ml/kg)",
            "Uso de vasopresores si persiste hipotensión",
            "Control de la fuente de infección",
            "Soporte de órganos fallo"
          ],
          notes: "Mortalidad 15-30%. Mejora con intervención temprana (<1 hora).",
          visualReferences: [
            {
              url: "https://placehold.co/800x400?text=Sepsis+Protocol",
              title: "Algoritmo de Sepsis",
              description: "Protocolo de manejo de sepsis"
            }
          ],
          source: {
            name: "Surviving Sepsis Campaign",
            url: "https://www.sccm.org/surviving-sepsis-campaign"
          },
          lastUpdated: "2023-08-20"
        }
      ],
      protocols: [
        {
          id: "acl",
          name: "Soporte Vital Básico",
          level: "Clase I",
          summary: "Procedimientos para reanimación cardiopulmonar",
          steps: [
            "Verificar escena segura",
            "Evaluar respuesta del paciente",
            "Activar sistema de emergencia",
            "Iniciar compresiones torácicas (100-120/min)",
            "Ventilaciones (30:2)",
            "Usar DEA si disponible"
          ]
        }
      ],
      quizzes: [
        {
          question: "¿Cuál es el primer paso en el manejo del IAMCEST?",
          options: ["Administrar aspirina", "Confirmación diagnóstica con ECG", "Establecer acceso venoso", "Administrar clopidogrel"],
          correct: 1
        },
        {
          question: "¿Cuál es el objetivo de puerta-balón en IAMCEST?",
          options: ["<30 minutos", "<60 minutos", "<90 minutos", "<120 minutos"],
          correct: 2
        }
      ]
    },
    farmacologia: {
      title: "Farmacología",
      icon: "fa-pills",
      description: "Información detallada sobre medicamentos y sus usos clínicos",
      medications: [
        {
          id: "aspirin",
          name: "Aspirina",
          genericName: "Ácido acetilsalicílico",
          classification: "Antiinflamatorio no esteroideo (AINE)",
          indications: ["Dolor leve a moderado", "Fiebre", "Antiagregante plaquetario", "Prevención de eventos cardiovasculares"],
          dosage: "Adultos: 325-650 mg cada 4-6 horas según necesidad. Máximo 4g/día",
          contraindications: ["Hipersensibilidad", "Úlcera péptica activa", "Hemorragia", "Asma inducida por AINEs"],
          sideEffects: ["Náuseas", "Dolor abdominal", "Sangrado gastrointestinal", "Tinnitus"],
          pharmacokinetics: "Absorción rápida en estómago e intestino. Metabolismo hepático.",
          warnings: "Riesgo de síndrome de Reye en niños. Interacción con anticoagulantes.",
          storage: "Conservar a temperatura ambiente, protegido de la humedad.",
          interactions: [
            {
              drug: "Warfarina",
              severity: "Severa",
              mechanism: "Aumento del riesgo de hemorragia",
              recommendation: "Evitar combinación si es posible. Monitorear INR de cerca."
            }
          ],
          images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aspirin_200mg.jpg/800px-Aspirin_200mg.jpg"],
          sources: [
            {
              name: "FDA",
              url: "https://www.fda.gov/drugs"
            }
          ],
          lastUpdated: "2023-07-15"
        },
        {
          id: "metformin",
          name: "Metformina",
          genericName: "Metformina",
          classification: "Antidiabético",
          indications: ["Diabetes tipo 2", "Síndrome de ovario poliquístico"],
          dosage: "Adultos: 500 mg 2 veces al día, aumentar gradualmente. Máximo 2550 mg/día",
          contraindications: ["Insuficiencia renal", "Acidosis metabólica", "Alergia a metformina"],
          sideEffects: ["Náuseas", "Diarrea", "Dolor abdominal", "Pérdida de apetito"],
          pharmacokinetics: "Absorción en intestino delgado. Excreción renal. No metabolizado.",
          warnings: "Riesgo de acidosis láctica en pacientes con disfunción renal.",
          storage: "Conservar a temperatura ambiente, protegido de la humedad.",
          interactions: [
            {
              drug: "Contraste yodado",
              severity: "Severa",
              mechanism: "Riesgo de acidosis láctica",
              recommendation: "Suspender metformina antes del procedimiento."
            }
          ],
          images: ["https://placehold.co/800x400?text=Metformin"],
          sources: [
            {
              name: "FDA",
              url: "https://www.fda.gov/drugs"
            }
          ],
          lastUpdated: "2023-08-15"
        }
      ],
      resources: [
        {
          title: "Micromedex",
          description: "Base de datos de farmacología clínica",
          url: "https://www.micromedexsolutions.com",
          icon: "fa-book-medical",
          category: "Referencia"
        },
        {
          title: "Lexicomp",
          description: "Información sobre medicamentos y dosificación",
          url: "https://www.lexicomp.com",
          icon: "fa-book-medical",
          category: "Referencia"
        }
      ]
    },
    procedimientos: {
      title: "Procedimientos",
      icon: "fa-procedures",
      description: "Guías para procedimientos médicos comunes",
      procedures: [
        {
          id: "lumbar_puncture",
          title: "Punción Lumbar",
          icon: "fa-bed",
          summary: "Procedimiento para obtener líquido cefalorraquídeo.",
          materials: ["Juego de punción lumbar", "Tubos para muestras", "Equipo estéril", "Anestesia local"],
          steps: [
            "Posición adecuada (lateral fetal o sentado)",
            "Identificación del espacio intervertebral",
            "Anestesia local",
            "Inserción de la aguja",
            "Recolección de muestras",
            "Retiro de la aguja y apósito"
          ],
          notes: "Indicado para diagnóstico de meningitis, hemorragia subaracnoidea, entre otros.",
          visualReferences: [
            {
              url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Lumbar_puncture_position.jpg/800px-Lumbar_puncture_position.jpg",
              title: "Posición para Punción Lumbar",
              description: "Posición lateral fetal con rodillas hacia el pecho"
            }
          ],
          source: {
            name: "UpToDate",
            url: "https://www.uptodate.com"
          },
          lastUpdated: "2023-09-10"
        },
        {
          id: "enteral",
          title: "Nutrición Enteral",
          icon: "fa-utensils",
          summary: "Administración de nutrientes a través del tracto gastrointestinal.",
          materials: ["Sonda nasogástrica", "Sonda nasoyeyunal", "Gastrostomía", "Yeyunostomía"],
          steps: [
            "Evaluación del paciente",
            "Elección del tipo de sonda",
            "Colocación de la sonda",
            "Confirmación de colocación",
            "Inicio de la nutrición",
            "Monitoreo y ajustes"
          ],
          notes: "Evaluar riesgo de aspiración. Iniciar lentamente. Monitorear tolerancia.",
          source: {
            name: "ASPEN Guidelines",
            url: "https://www.nutritioncare.org"
          },
          lastUpdated: "2023-08-05"
        }
      ]
    },
    enfermedades: {
      title: "Enfermedades",
      icon: "fa-disease",
      description: "Información detallada sobre enfermedades y su manejo",
      diseases: [
        {
          id: "diabetes",
          name: "Diabetes Mellitus",
          classification: "Tipo 1 y Tipo 2",
          prevalence: "9.3% global",
          description: "Trastorno metabólico caracterizado por hiperglucemia crónica debido a defectos en la secreción de insulina, acción de la insulina, o ambos.",
          symptoms: ["Poliuria", "Polidipsia", "Pérdida de peso", "Fatiga", "Visión borrosa"],
          diagnosis: ["Glucosa plasmática en ayunas ≥126 mg/dL", "HbA1c ≥6.5%", "Glucosa plasmática al azar ≥200 mg/dL con síntomas"],
          treatment: ["Modificación del estilo de vida", "Terapia farmacológica", "Monitoreo glucémico", "Educación del paciente"],
          complications: ["Neuropatía", "Retinopatía", "Nefropatía", "Enfermedad cardiovascular"],
          prevention: ["Control glucémico", "Ejercicio regular", "Dieta balanceada", "Cuidado de los pies"],
          visualReferences: [
            {
              url: "https://placehold.co/800x400?text=Diabetes+Management",
              title: "Algoritmo de Manejo de Diabetes",
              description: "Flujo de tratamiento para diabetes tipo 2"
            }
          ],
          source: {
            name: "ADA Guidelines",
            url: "https://www.diabetes.org"
          },
          lastUpdated: "2023-09-20"
        },
        {
          id: "hipertension",
          name: "Hipertensión Arterial",
          classification: "Primaria y Secundaria",
          prevalence: "25-30% adultos",
          description: "Aumento persistente de la presión arterial por encima de 140/90 mmHg.",
          symptoms: ["Asintomática", "Cefalea", "Mareos", "Epistaxis", "Palpitaciones"],
          diagnosis: ["Medición de PA en múltiples ocasiones", "Evaluación de factores de riesgo", "Estudios complementarios"],
          treatment: ["Modificación del estilo de vida", "Terapia farmacológica", "Monitoreo regular"],
          complications: ["Enfermedad cardiovascular", "Accidente cerebrovascular", "Insuficiencia renal", "Retinopatía"],
          prevention: ["Dieta DASH", "Reducción de sodio", "Ejercicio", "Control de peso"],
          visualReferences: [
            {
              url: "https://placehold.co/800x400?text=Hypertension+Stages",
              title: "Clasificación de Hipertensión",
              description: "Etapas de hipertensión según JNC 8"
            }
          ],
          source: {
            name: "ACC/AHA Guidelines",
            url: "https://www.acc.org"
          },
          lastUpdated: "2023-08-25"
        }
      ],
      resources: [
        {
          title: "GINA Guidelines",
          description: "Guías globales para el manejo del asma",
          url: "https://ginasthma.org",
          icon: "fa-book-medical",
          category: "Referencia"
        },
        {
          title: "GOLD Guidelines",
          description: "Guías para el manejo de la EPOC",
          url: "https://goldcopd.org",
          icon: "fa-book-medical",
          category: "Referencia"
        }
      ]
    },
    nutricion: {
      title: "Nutrición",
      icon: "fa-apple-alt",
      description: "Técnicas y recomendaciones para el manejo nutricional",
      procedures: [
        {
          id: "enteral",
          title: "Nutrición Enteral",
          icon: "fa-utensils",
          summary: "Administración de nutrientes a través del tracto gastrointestinal.",
          materials: ["Sonda nasogástrica", "Sonda nasoyeyunal", "Gastrostomía", "Yeyunostomía"],
          steps: [
            "Evaluación del paciente",
            "Elección del tipo de sonda",
            "Colocación de la sonda",
            "Confirmación de colocación",
            "Inicio de la nutrición",
            "Monitoreo y ajustes"
          ],
          notes: "Evaluar riesgo de aspiración. Iniciar lentamente. Monitorear tolerancia.",
          source: {
            name: "ESPEN Guidelines",
            url: "https://www.espen.org"
          },
          lastUpdated: "2023-07-30"
        },
        {
          id: "parenteral",
          title: "Nutrición Parenteral",
          icon: "fa-syringe",
          summary: "Administración de nutrientes por vía intravenosa.",
          materials: ["Soluciones nutricionales", "Catéter central", "Equipo de infusión", "Bomba de infusión"],
          steps: [
            "Evaluación del estado nutricional",
            "Cálculo de requerimientos",
            "Preparación de la solución",
            "Colocación del catéter",
            "Inicio de la infusión",
            "Monitoreo de electrolitos y glucosa"
          ],
          notes: "Indicado cuando no es posible la nutrición enteral. Riesgo de complicaciones infecciosas.",
          source: {
            name: "ASPEN Guidelines",
            url: "https://www.nutritioncare.org"
          },
          lastUpdated: "2023-08-12"
        }
      ]
    },
    recursos: {
      title: "Recursos",
      icon: "fa-book-open",
      description: "Herramientas y referencias para profesionales de la salud",
      resources: [
        {
          title: "Micromedex",
          description: "Base de datos de farmacología clínica",
          url: "https://www.micromedexsolutions.com",
          icon: "fa-book-medical",
          category: "Referencia"
        },
        {
          title: "Lexicomp",
          description: "Información sobre medicamentos y dosificación",
          url: "https://www.lexicomp.com",
          icon: "fa-book-medical",
          category: "Referencia"
        },
        {
          title: "Quiz de ECG",
          description: "Evaluación de interpretación de electrocardiogramas",
          url: "https://ecgquiz.com",
          icon: "fa-heart-pulse",
          category: "Cardiología"
        },
        {
          title: "Quiz de Radiografías",
          description: "Evaluación de lectura de imágenes",
          url: "https://radiologyquiz.com",
          icon: "fa-x-ray",
          category: "Imágenes"
        }
      ],
      externalLinks: [
        {
          title: "PubMed",
          description: "Base de datos de literatura biomédica",
          url: "https://pubmed.ncbi.nlm.nih.gov",
          icon: "fa-search"
        },
        {
          title: "CDC Guidelines",
          description: "Guías para el control de infecciones",
          url: "https://www.cdc.gov/infectioncontrol/guidelines",
          icon: "fa-virus"
        }
      ],
      videos: [
        {
          id: "v1",
          title: "Técnica de RCP",
          description: "Demonstración de reanimación cardiopulmonar",
          thumbnail: "https://placehold.co/300x180?text=RCP+Technique",
          url: "https://youtube.com"
        },
        {
          id: "v2",
          title: "Colocación de SNG",
          description: "Procedimiento para colocación de sonda nasogástrica",
          thumbnail: "https://placehold.co/300x180?text=SNG+Placement",
          url: "https://youtube.com"
        }
      ]
    },
    simulador: {
      title: "Simulador Clínico",
      icon: "fa-laptop-medical",
      description: "Entorno de simulación para escenarios clínicos",
      vitals: [
        { id: "hr", label: "Frecuencia Cardíaca", value: "80 lpm", unit: "lpm", normal: "60-100" },
        { id: "bp", label: "Presión Arterial", value: "120/80 mmHg", unit: "mmHg", normal: "120/80" },
        { id: "rr", label: "Frecuencia Respiratoria", value: "16 rpm", unit: "rpm", normal: "12-20" },
        { id: "temp", label: "Temperatura", value: "37°C", unit: "°C", normal: "36.5-37.5" },
        { id: "spo2", label: "Saturación de O2", value: "98%", unit: "%", normal: "95-100" },
        { id: "gluc", label: "Glucemia", value: "90 mg/dL", unit: "mg/dL", normal: "70-110" }
      ],
      scenarios: [
        {
          id: "shock",
          name: "Shock Séptico",
          changes: {
            hr: { value: "120 lpm", color: "#ef4444" },
            bp: { value: "80/50 mmHg", color: "#ef4444" },
            rr: { value: "28 rpm", color: "#ef4444" },
            temp: { value: "39°C", color: "#ef4444" },
            spo2: { value: "92%", color: "#f59e0b" }
          }
        },
        {
          id: "iam",
          name: "IAM con Elevación del ST",
          changes: {
            hr: { value: "110 lpm", color: "#ef4444" },
            bp: { value: "90/60 mmHg", color: "#ef4444" },
            rr: { value: "24 rpm", color: "#ef4444" },
            spo2: { value: "94%", color: "#f59e0b" },
            gluc: { value: "180 mg/dL", color: "#ef4444" }
          }
        }
      ]
    },
    evaluacion: {
      title: "Evaluación",
      icon: "fa-clipboard-check",
      description: "Cuestionarios para evaluar conocimientos médicos",
      quizzes: {
        emergencias: [
          {
            question: "¿Cuál es el primer paso en el manejo del IAMCEST?",
            options: ["Administrar aspirina", "Confirmación diagnóstica con ECG", "Establecer acceso venoso", "Administrar clopidogrel"],
            correct: 1
          },
          {
            question: "¿Cuál es el objetivo de puerta-balón en IAMCEST?",
            options: ["<30 minutos", "<60 minutos", "<90 minutos", "<120 minutos"],
            correct: 2
          }
        ],
        procedimientos: [
          {
            question: "¿Cuál es el primer paso en la curación de una herida quirúrgica?",
            options: ["Aplicar el antiséptico", "Lavado de manos y colocación de guantes", "Retirar el apósito anterior", "Evaluar características de la herida"],
            correct: 1
          },
          {
            question: "¿Qué solución se recomienda para limpiar la mayoría de las heridas?",
            options: ["Agua oxigenada", "Solución salina fisiológica", "Alcohol etílico", "Povidona yodada"],
            correct: 1
          }
        ]
      }
    }
  };

  // Load data from localStorage
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const savedFavorites = localStorage.getItem('medicalAppFavorites');
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

        const savedSearchHistory = localStorage.getItem('medicalAppSearchHistory');
        if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory));

        const savedAppHistory = localStorage.getItem('medicalAppHistory');
        if (savedAppHistory) setAppHistory(JSON.parse(savedAppHistory));

        const savedTheme = localStorage.getItem('medicalAppTheme');
        if (savedTheme) setTheme(savedTheme);

        const savedState = localStorage.getItem('medicalAppState');
        if (savedState) {
          const state = JSON.parse(savedState);
          setCurrentCategory(state.currentCategory || 'emergencias');
        }
      } catch (e) {
        console.error('Error loading from localStorage:', e);
      }
    };

    loadFromLocalStorage();
  }, []);

  // Save data to localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('medicalAppFavorites', JSON.stringify(favorites));
      localStorage.setItem('medicalAppSearchHistory', JSON.stringify(searchHistory));
      localStorage.setItem('medicalAppHistory', JSON.stringify(appHistory));
      localStorage.setItem('medicalAppTheme', theme);
      localStorage.setItem('medicalAppState', JSON.stringify({ currentCategory }));
      showNotification('Cambios guardados correctamente');
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      showNotification('Error al guardar los datos', 'error');
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Add to history
  const addToHistory = (category, itemId = null) => {
    const timestamp = new Date().toISOString();
    const historyItem = { category, itemId, timestamp };
    setAppHistory(prev => {
      const newHistory = [historyItem, ...prev];
      return newHistory.length > 20 ? newHistory.slice(0, 20) : newHistory;
    });
    saveToLocalStorage();
  };

  // Add to search history
  const addToSearchHistory = (term) => {
    if (!term.trim()) return;
    if (searchHistory.length > 0 && searchHistory[0] === term) return;
    
    setSearchHistory(prev => {
      const newHistory = [term, ...prev];
      return newHistory.length > 10 ? newHistory.slice(0, 10) : newHistory;
    });
    saveToLocalStorage();
  };

  // Toggle favorite
  const toggleFavorite = (category, itemId) => {
    const index = favorites.findIndex(fav => fav.category === category && fav.itemId === itemId);
    if (index === -1) {
      setFavorites(prev => [...prev, { category, itemId }]);
      showNotification('Añadido a favoritos');
    } else {
      setFavorites(prev => prev.filter((_, i) => i !== index));
      showNotification('Eliminado de favoritos');
    }
    saveToLocalStorage();
  };

  // Check if item is favorite
  const isFavorite = (category, itemId) => {
    return favorites.some(fav => fav.category === category && fav.itemId === itemId);
  };

  // Handle search
  const handleSearch = () => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (searchTerm.trim()) {
        addToSearchHistory(searchTerm);
        showNotification(`Buscando: ${searchTerm}`);
      }
    }, 300);
  };

  // Activate category
  const activateCategory = (category) => {
    setCurrentCategory(category);
    setActiveTab('procedures');
    addToHistory(category);
    saveToLocalStorage();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Render components
  const renderEmergenciasContent = () => {
    const data = medicalData.emergencias;
    if (!data || !data.procedures) {
      return (
        <div className="empty-state glass-effect">
          <i className="fas fa-exclamation-circle text-4xl text-gray-400"></i>
          <h3 className="text-lg font-semibold text-gray-700">Datos no disponibles</h3>
          <p className="text-gray-600">No hay información para mostrar en este momento.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="page-header glass-effect p-6 rounded-xl">
          <h1 className="page-title text-2xl font-bold text-gray-800 flex items-center gap-3">
            <i className={`fas ${data.icon} text-blue-500`}></i>
            {data.title}
          </h1>
          <p className="page-description text-gray-600 mt-2">{data.description}</p>
        </div>

        <div className="tabs glass-effect rounded-xl overflow-hidden">
          <div 
            className={`tab px-6 py-4 cursor-pointer ${activeTab === 'procedures' ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('procedures')}
          >
            Procedimientos
          </div>
          <div 
            className={`tab px-6 py-4 cursor-pointer ${activeTab === 'protocols' ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('protocols')}
          >
            Protocolos
          </div>
          <div 
            className={`tab px-6 py-4 cursor-pointer ${activeTab === 'quizzes' ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('quizzes')}
          >
            Evaluación
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'procedures' && (
            <div className="space-y-6">
              {data.procedures.map(procedure => (
                <div key={procedure.id} className="procedure-detail glass-effect rounded-xl overflow-hidden">
                  <div className="procedure-header">
                    <i className={`fas ${procedure.icon} text-blue-500`}></i>
                    <h2 className="procedure-title font-semibold text-gray-800">{procedure.title}</h2>
                    <button 
                      onClick={() => toggleFavorite('emergencias', procedure.id)}
                      className={`ml-auto p-2 rounded-full ${isFavorite('emergencias', procedure.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                  <div className="procedure-summary bg-gray-50 px-6 py-4 border-b">
                    {procedure.summary}
                  </div>
                  <div className="p-6">
                    <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                      <i className="fas fa-box-open text-blue-500"></i>
                      <h3 className="font-semibold">Materiales</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {procedure.materials.map((material, index) => (
                        <span key={index} className="material-tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {material}
                        </span>
                      ))}
                    </div>

                    <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                      <i className="fas fa-list-ol text-blue-500"></i>
                      <h3 className="font-semibold">Pasos del Procedimiento</h3>
                    </div>
                    <ol className="list-decimal list-inside space-y-3 mb-6">
                      {procedure.steps.map((step, index) => (
                        <li key={index} className="text-gray-700 ml-4">{step}</li>
                      ))}
                    </ol>

                    {procedure.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-2">
                          <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                          <div>
                            <strong className="text-yellow-800">Nota:</strong>
                            <p className="text-yellow-700 text-sm mt-1">{procedure.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {procedure.visualReferences && procedure.visualReferences.length > 0 && (
                      <div className="visual-reference mb-6">
                        <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                          <i className="fas fa-image text-blue-500"></i>
                          <h3 className="font-semibold">Referencias Visuales</h3>
                        </div>
                        <div className="grid gap-4">
                          {procedure.visualReferences.map((ref, index) => (
                            <div key={index} className="glass-effect rounded-lg overflow-hidden">
                              <img 
                                src={ref.url} 
                                alt={ref.title} 
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/800x400?text=Imagen+no+disponible';
                                }}
                              />
                              <div className="p-4">
                                <h4 className="font-semibold text-gray-800">{ref.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{ref.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="source flex items-center gap-2 text-sm text-gray-600">
                      <i className="fas fa-link"></i>
                      <span>Fuente:</span>
                      <a 
                        href={procedure.source.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {procedure.source.name}
                      </a>
                      <span className="last-updated">• Actualizado: {formatDate(procedure.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'protocols' && (
            <div className="space-y-6">
              {data.protocols && data.protocols.map(protocol => (
                <div key={protocol.id} className="protocol-container glass-effect rounded-xl p-6">
                  <div className="protocol-header flex items-center gap-3 mb-4">
                    <i className="fas fa-clipboard-check text-blue-500 text-xl"></i>
                    <h2 className="protocol-title text-xl font-semibold text-gray-800">{protocol.name}</h2>
                  </div>
                  <p className="protocol-summary text-gray-600 mb-4">Nivel de evidencia: {protocol.level}</p>
                  <ol className="protocol-steps list-decimal list-inside space-y-3">
                    {protocol.steps.map((step, index) => (
                      <li key={index} className="protocol-step text-gray-700 ml-4">{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="quiz-container glass-effect rounded-xl p-6">
              <div className="section-title flex items-center gap-2 text-gray-800 mb-6">
                <i className="fas fa-clipboard-check text-blue-500"></i>
                <h2 className="text-xl font-semibold">Evaluación</h2>
              </div>
              {data.quizzes && data.quizzes.map((quiz, index) => (
                <div key={index} className="quiz-question mb-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 mb-4">{quiz.question}</p>
                  <div className="space-y-2">
                    {quiz.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name={`quiz-${index}`} className="text-blue-600" />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button className="control-btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                Enviar Respuestas
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFarmacologiaContent = () => {
    const data = medicalData.farmacologia;
    if (!data || !data.medications) {
      return (
        <div className="empty-state glass-effect">
          <i className="fas fa-exclamation-circle text-4xl text-gray-400"></i>
          <h3 className="text-lg font-semibold text-gray-700">Datos no disponibles</h3>
          <p className="text-gray-600">No hay información para mostrar en este momento.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="page-header glass-effect p-6 rounded-xl">
          <h1 className="page-title text-2xl font-bold text-gray-800 flex items-center gap-3">
            <i className={`fas ${data.icon} text-blue-500`}></i>
            {data.title}
          </h1>
          <p className="page-description text-gray-600 mt-2">{data.description}</p>
        </div>

        <div className="grid gap-6">
          {data.medications.map(medication => (
            <div key={medication.id} className="medication-card glass-effect rounded-xl overflow-hidden">
              <div className="medication-header p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="medication-title text-2xl font-bold text-gray-800">{medication.name}</h2>
                    <p className="medication-generic text-gray-600">{medication.genericName}</p>
                  </div>
                  <button 
                    onClick={() => toggleFavorite('farmacologia', medication.id)}
                    className={`p-3 rounded-full ${isFavorite('farmacologia', medication.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <i className="fas fa-heart text-xl"></i>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="info-grid grid md:grid-cols-2 gap-6">
                  <div className="info-item glass-effect rounded-lg p-4">
                    <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                      <i className="fas fa-flask"></i>
                      <span>Clasificación</span>
                    </div>
                    <div className="info-value text-gray-800">{medication.classification}</div>
                  </div>

                  <div className="info-item glass-effect rounded-lg p-4">
                    <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                      <i className="fas fa-prescription"></i>
                      <span>Dosificación</span>
                    </div>
                    <div className="info-value text-gray-800">{medication.dosage}</div>
                  </div>

                  <div className="info-item glass-effect rounded-lg p-4">
                    <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                      <i className="fas fa-check-circle"></i>
                      <span>Indicaciones</span>
                    </div>
                    <div className="info-value text-gray-800">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.indications.map((ind, i) => (
                          <li key={i}>{ind}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="info-item glass-effect rounded-lg p-4">
                    <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Contraindicaciones</span>
                    </div>
                    <div className="info-value text-gray-800">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.contraindications.map((contra, i) => (
                          <li key={i}>{contra}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="section-title flex items-center gap-2 text-gray-800 mt-6 mb-4">
                  <i className="fas fa-bug text-blue-500"></i>
                  <h3 className="font-semibold">Efectos Secundarios</h3>
                </div>
                <div className="side-effects bg-gray-50 rounded-lg p-4 mb-6">
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {medication.sideEffects.map((effect, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-circle text-xs text-gray-400"></i>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                  <i className="fas fa-sync-alt text-blue-500"></i>
                  <h3 className="font-semibold">Interacciones</h3>
                </div>
                <div className="interactions space-y-4 mb-6">
                  {medication.interactions.map((inter, i) => (
                    <div key={i} className="interaction-item glass-effect rounded-lg p-4 border-l-4 border-red-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{inter.drug}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          inter.severity === 'Severa' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {inter.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2"><strong>Mecanismo:</strong> {inter.mechanism}</p>
                      <p className="text-sm text-gray-600"><strong>Recomendación:</strong> {inter.recommendation}</p>
                    </div>
                  ))}
                </div>

                <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                  <i className="fas fa-info-circle text-blue-500"></i>
                  <h3 className="font-semibold">Información Adicional</h3>
                </div>
                <div className="additional-info grid md:grid-cols-2 gap-6 mb-6">
                  <div className="info-item glass-effect rounded-lg p-4">
                    <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                      <i className="fas fa-route"></i>
                      <span>Farmacocinética</span>
                    </div>
                    <div className="info-value text-gray-800">{medication.pharmacokinetics}</div>
                  </div>

                  <div className="info-item glass-effect rounded-lg p-4">
                    <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Advertencias</span>
                    </div>
                    <div className="info-value text-gray-800">{medication.warnings}</div>
                  </div>

                  <div className="info-item glass-effect rounded-lg p-4">
                    <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                      <i className="fas fa-warehouse"></i>
                      <span>Almacenamiento</span>
                    </div>
                    <div className="info-value text-gray-800">{medication.storage}</div>
                  </div>
                </div>

                {medication.images && medication.images.length > 0 && (
                  <div className="medication-images mb-6">
                    <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                      <i className="fas fa-image text-blue-500"></i>
                      <h3 className="font-semibold">Imagen del Medicamento</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {medication.images.map((img, i) => (
                        <div key={i} className="glass-effect rounded-lg overflow-hidden">
                          <img 
                            src={img} 
                            alt={`${medication.name} ${i + 1}`} 
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/400x200?text=Imagen+no+disponible';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="source flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-link"></i>
                  <span>Fuente:</span>
                  <a 
                    href={medication.sources[0].url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {medication.sources[0].name}
                  </a>
                  <span className="last-updated">• Actualizado: {formatDate(medication.lastUpdated)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProcedimientosContent = () => {
    const data = medicalData.procedimientos;
    if (!data || !data.procedures) {
      return (
        <div className="empty-state glass-effect">
          <i className="fas fa-exclamation-circle text-4xl text-gray-400"></i>
          <h3 className="text-lg font-semibold text-gray-700">Datos no disponibles</h3>
          <p className="text-gray-600">No hay información para mostrar en este momento.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="page-header glass-effect p-6 rounded-xl">
          <h1 className="page-title text-2xl font-bold text-gray-800 flex items-center gap-3">
            <i className={`fas ${data.icon} text-blue-500`}></i>
            {data.title}
          </h1>
          <p className="page-description text-gray-600 mt-2">{data.description}</p>
        </div>

        <div className="grid gap-6">
          {data.procedures.map(procedure => (
            <div key={procedure.id} className="procedure-detail glass-effect rounded-xl overflow-hidden">
              <div className="procedure-header">
                <i className={`fas ${procedure.icon} text-blue-500`}></i>
                <h2 className="procedure-title font-semibold text-gray-800">{procedure.title}</h2>
                <button 
                  onClick={() => toggleFavorite('procedimientos', procedure.id)}
                  className={`ml-auto p-2 rounded-full ${isFavorite('procedimientos', procedure.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              <div className="procedure-summary bg-gray-50 px-6 py-4 border-b">
                {procedure.summary}
              </div>
              <div className="p-6">
                <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                  <i className="fas fa-box-open text-blue-500"></i>
                  <h3 className="font-semibold">Materiales</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {procedure.materials.map((material, index) => (
                    <span key={index} className="material-tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {material}
                    </span>
                  ))}
                </div>

                <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                  <i className="fas fa-list-ol text-blue-500"></i>
                  <h3 className="font-semibold">Pasos del Procedimiento</h3>
                </div>
                <ol className="list-decimal list-inside space-y-3 mb-6">
                  {procedure.steps.map((step, index) => (
                    <li key={index} className="text-gray-700 ml-4">{step}</li>
                  ))}
                </ol>

                {procedure.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                      <div>
                        <strong className="text-yellow-800">Nota:</strong>
                        <p className="text-yellow-700 text-sm mt-1">{procedure.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {procedure.visualReferences && procedure.visualReferences.length > 0 && (
                  <div className="visual-reference mb-6">
                    <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                      <i className="fas fa-image text-blue-500"></i>
                      <h3 className="font-semibold">Referencias Visuales</h3>
                    </div>
                    <div className="grid gap-4">
                      {procedure.visualReferences.map((ref, index) => (
                        <div key={index} className="glass-effect rounded-lg overflow-hidden">
                          <img 
                            src={ref.url} 
                            alt={ref.title} 
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/800x400?text=Imagen+no+disponible';
                            }}
                          />
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-800">{ref.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{ref.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="source flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-link"></i>
                  <span>Fuente:</span>
                  <a 
                    href={procedure.source.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {procedure.source.name}
                  </a>
                  <span className="last-updated">• Actualizado: {formatDate(procedure.lastUpdated)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEnfermedadesContent = () => {
    const data = medicalData.enfermedades;
    if (!data || !data.diseases) {
      return (
        <div className="empty-state glass-effect">
          <i className="fas fa-exclamation-circle text-4xl text-gray-400"></i>
          <h3 className="text-lg font-semibold text-gray-700">Datos no disponibles</h3>
          <p className="text-gray-600">No hay información para mostrar en este momento.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="page-header glass-effect p-6 rounded-xl">
          <h1 className="page-title text-2xl font-bold text-gray-800 flex items-center gap-3">
            <i className={`fas ${data.icon} text-blue-500`}></i>
            {data.title}
          </h1>
          <p className="page-description text-gray-600 mt-2">{data.description}</p>
        </div>

        <div className="tabs glass-effect rounded-xl overflow-hidden">
          <div 
            className={`tab px-6 py-4 cursor-pointer ${activeTab === 'diseases' ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('diseases')}
          >
            Enfermedades
          </div>
          <div 
            className={`tab px-6 py-4 cursor-pointer ${activeTab === 'resources' ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('resources')}
          >
            Recursos
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'diseases' && (
            <div className="grid gap-6">
              {data.diseases.map(disease => (
                <div key={disease.id} className="disease-card glass-effect rounded-xl overflow-hidden">
                  <div className="disease-header">
                    <h2 className="disease-title font-semibold text-gray-800">{disease.name}</h2>
                    <span className="disease-prevalence bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {disease.prevalence}
                    </span>
                    <button 
                      onClick={() => toggleFavorite('enfermedades', disease.id)}
                      className={`ml-auto p-2 rounded-full ${isFavorite('enfermedades', disease.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                  
                  <div className="disease-description p-6">
                    <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                      <i className="fas fa-vial text-blue-500"></i>
                      <h3 className="font-semibold">Clasificación</h3>
                    </div>
                    <p className="text-gray-700 mb-6">{disease.classification}</p>

                    <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                      <i className="fas fa-info-circle text-blue-500"></i>
                      <h3 className="font-semibold">Descripción</h3>
                    </div>
                    <p className="text-gray-700 mb-6">{disease.description}</p>

                    <div className="info-grid grid md:grid-cols-2 gap-6 mb-6">
                      <div className="info-item glass-effect rounded-lg p-4">
                        <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                          <i className="fas fa-heartbeat"></i>
                          <span>Síntomas</span>
                        </div>
                        <div className="info-value text-gray-800">
                          <ul className="list-disc list-inside space-y-1">
                            {disease.symptoms.map((symptom, i) => (
                              <li key={i}>{symptom}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="info-item glass-effect rounded-lg p-4">
                        <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                          <i className="fas fa-stethoscope"></i>
                          <span>Diagnóstico</span>
                        </div>
                        <div className="info-value text-gray-800">
                          <ul className="list-disc list-inside space-y-1">
                            {disease.diagnosis.map((diag, i) => (
                              <li key={i}>{diag}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="info-item glass-effect rounded-lg p-4">
                        <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                          <i className="fas fa-capsules"></i>
                          <span>Tratamiento</span>
                        </div>
                        <div className="info-value text-gray-800">
                          <ul className="list-disc list-inside space-y-1">
                            {disease.treatment.map((treat, i) => (
                              <li key={i}>{treat}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="info-item glass-effect rounded-lg p-4">
                        <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>Complicaciones</span>
                        </div>
                        <div className="info-value text-gray-800">
                          <ul className="list-disc list-inside space-y-1">
                            {disease.complications.map((comp, i) => (
                              <li key={i}>{comp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="info-item glass-effect rounded-lg p-4">
                        <div className="info-label flex items-center gap-2 text-sm font-medium text-gray-600">
                          <i className="fas fa-shield-alt"></i>
                          <span>Prevención</span>
                        </div>
                        <div className="info-value text-gray-800">
                          <ul className="list-disc list-inside space-y-1">
                            {disease.prevention.map((prev, i) => (
                              <li key={i}>{prev}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {disease.visualReferences && disease.visualReferences.length > 0 && (
                      <div className="visual-reference mb-6">
                        <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                          <i className="fas fa-image text-blue-500"></i>
                          <h3 className="font-semibold">Referencias Visuales</h3>
                        </div>
                        <div className="grid gap-4">
                          {disease.visualReferences.map((ref, index) => (
                            <div key={index} className="glass-effect rounded-lg overflow-hidden">
                              <img 
                                src={ref.url} 
                                alt={ref.title} 
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/800x400?text=Imagen+no+disponible';
                                }}
                              />
                              <div className="p-4">
                                <h4 className="font-semibold text-gray-800">{ref.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{ref.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="source flex items-center gap-2 text-sm text-gray-600">
                      <i className="fas fa-link"></i>
                      <span>Fuente:</span>
                      <a 
                        href={disease.source.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {disease.source.name}
                      </a>
                      <span className="last-updated">• Actualizado: {formatDate(disease.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="resources-container glass-effect rounded-xl p-6">
              <div className="section-title flex items-center gap-2 text-gray-800 mb-6">
                <i className="fas fa-book-open text-blue-500"></i>
                <h2 className="text-xl font-semibold">Recursos Recomendados</h2>
              </div>
              <div className="resource-grid grid md:grid-cols-2 gap-6">
                {data.resources && data.resources.map(resource => (
                  <div key={resource.title} className="resource-card glass-effect rounded-xl p-6">
                    <div className="resource-title flex items-center gap-3 text-lg font-semibold text-gray-800">
                      <i className={`fas ${resource.icon} text-blue-500`}></i>
                      {resource.title}
                    </div>
                    <p className="resource-description text-gray-600 mb-4">{resource.description}</p>
                    <div className="resource-category bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm inline-block mb-4">
                      {resource.category}
                    </div>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="resource-link bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold inline-block w-full text-center transition-all"
                    >
                      Visitar Recurso
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNutricionContent = () => {
    const data = medicalData.nutricion;
    if (!data || !data.procedures) {
      return (
        <div className="empty-state glass-effect">
          <i className="fas fa-exclamation-circle text-4xl text-gray-400"></i>
          <h3 className="text-lg font-semibold text-gray-700">Datos no disponibles</h3>
          <p className="text-gray-600">No hay información para mostrar en este momento.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="page-header glass-effect p-6 rounded-xl">
          <h1 className="page-title text-2xl font-bold text-gray-800 flex items-center gap-3">
            <i className={`fas ${data.icon} text-blue-500`}></i>
            {data.title}
          </h1>
          <p className="page-description text-gray-600 mt-2">{data.description}</p>
        </div>

        <div className="grid gap-6">
          {data.procedures.map(procedure => (
            <div key={procedure.id} className="procedure-detail glass-effect rounded-xl overflow-hidden">
              <div className="procedure-header">
                <i className={`fas ${procedure.icon} text-blue-500`}></i>
                <h2 className="procedure-title font-semibold text-gray-800">{procedure.title}</h2>
                <button 
                  onClick={() => toggleFavorite('nutricion', procedure.id)}
                  className={`ml-auto p-2 rounded-full ${isFavorite('nutricion', procedure.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              <div className="procedure-summary bg-gray-50 px-6 py-4 border-b">
                {procedure.summary}
              </div>
              <div className="p-6">
                <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                  <i className="fas fa-box-open text-blue-500"></i>
                  <h3 className="font-semibold">Materiales</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {procedure.materials.map((material, index) => (
                    <span key={index} className="material-tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {material}
                    </span>
                  ))}
                </div>

                <div className="section-title flex items-center gap-2 text-gray-800 mb-4">
                  <i className="fas fa-list-ol text-blue-500"></i>
                  <h3 className="font-semibold">Pasos del Procedimiento</h3>
                </div>
                <ol className="list-decimal list-inside space-y-3 mb-6">
                  {procedure.steps.map((step, index) => (
                    <li key={index} className="text-gray-700 ml-4">{step}</li>
                  ))}
                </ol>

                {procedure.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                      <div>
                        <strong className="text-yellow-800">Nota:</strong>
                        <p className="text-yellow-700 text-sm mt-1">{procedure.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="source flex items-center gap-2 text-sm text-gray-600">
                  <i className="fas fa-link"></i>
                  <span>Fuente:</span>
                  <a 
                    href={procedure.source.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {procedure.source.name}
                  </a>
                  <span className="last-updated">• Actualizado: {formatDate(procedure.lastUpdated)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecursosContent = () => {
    const data = medicalData.recursos;
    if (!data || !data.resources) {
      return (
        <div className="empty-state glass-effect">
          <i className="fas fa-exclamation-circle text-4xl text-gray-400"></i>
          <h3 className="text-lg font-semibold text-gray-700">Datos no disponibles</h3>
          <p className="text-gray-600">No hay información para mostrar en este momento.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="page-header glass-effect p-6 rounded-xl">
          <h1 className="page-title text-2xl font-bold text-gray-800 flex items-center gap-3">
            <i className={`fas ${data.icon} text-blue-500`}></i>
            {data.title}
          </h1>
          <p className="page-description text-gray-600 mt-2">{data.description}</p>
        </div>

        <div className="tabs glass-effect rounded-xl overflow-hidden">
          <div 
            className={`tab px-6 py-4 cursor-pointer ${activeTab === 'resources' ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('resources')}
          >
            Recursos
          </div>
          <div 
            className={`tab px-6 py-4 cursor-pointer ${activeTab === 'external' ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('external')}
          >
            Enlaces Externos
          </div>
          <div 
            className={`tab px-6 py-4 cursor-pointer ${activeTab === 'videos' ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos Recomendados
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'resources' && (
            <div className="resource-grid grid md:grid-cols-2 gap-6">
              {data.resources.map(resource => (
                <div key={resource.title} className="resource-card glass-effect rounded-xl p-6">
                  <div className="resource-title flex items-center gap-3 text-lg font-semibold text-gray-800">
                    <i className={`fas ${resource.icon} text-blue-500`}></i>
                    {resource.title}
                  </div>
                  <p className="resource-description text-gray-600 mb-4">{resource.description}</p>
                  <div className="resource-category bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm inline-block mb-4">
                    {resource.category}
                  </div>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="resource-link bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold inline-block w-full text-center transition-all"
                  >
                    Visitar Recurso
                  </a>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'external' && (
            <div className="external-links-container glass-effect rounded-xl p-6">
              <div className="section-title flex items-center gap-2 text-gray-800 mb-6">
                <i className="fas fa-external-link-alt text-blue-500"></i>
                <h2 className="text-xl font-semibold">Enlaces Externos Recomendados</h2>
              </div>
              <div className="external-links grid md:grid-cols-2 gap-4">
                {data.externalLinks.map(link => (
                  <a 
                    key={link.title} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="external-link glass-effect rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 transition-all"
                  >
                    <i className={`fas ${link.icon} text-blue-500 text-xl`}></i>
                    <div>
                      <div className="font-semibold text-gray-800">{link.title}</div>
                      <div className="text-gray-600 text-sm">{link.description}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="videos-container glass-effect rounded-xl p-6">
              <div className="section-title flex items-center gap-2 text-gray-800 mb-6">
                <i className="fas fa-video text-blue-500"></i>
                <h2 className="text-xl font-semibold">Videos Recomendados</h2>
              </div>
              <div className="video-grid grid md:grid-cols-2 gap-6">
                {data.videos.map(video => (
                  <div key={video.id} className="video-card glass-effect rounded-xl overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="video-thumbnail w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x180?text=Video+no+disponible';
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{video.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="resource-link bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold inline-block w-full text-center transition-all"
                      >
                        Ver Video
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSimuladorContent = () => {
    const data = medicalData.simulador;
    const [vitals, setVitals] = useState(data.vitals);

    const applyScenario = (scenarioId) => {
      const scenario = data.scenarios.find(s => s.id === scenarioId);
      if (!scenario) return;

      setVitals(prev => 
        prev.map(vital => {
          const newValue = scenario.changes[vital.id]?.value || vital.value;
          return { ...vital, value: newValue, color: scenario.changes[vital.id]?.color || 'inherit' };
        })
      );
      showNotification(`Escenario aplicado: ${scenario.name}`);
    };

    const resetVitals = () => {
      setVitals(data.vitals.map(vital => ({ ...vital, color: 'inherit' })));
      showNotification('Valores restablecidos a normales');
    };

    return (
      <div className="space-y-6">
        <div className="page-header glass-effect p-6 rounded-xl">
          <h1 className="page-title text-2xl font-bold text-gray-800 flex items-center gap-3">
            <i className={`fas ${data.icon} text-blue-500`}></i>
            {data.title}
          </h1>
          <p className="page-description text-gray-600 mt-2">{data.description}</p>
        </div>

        <div className="simulator-container glass-effect rounded-xl p-6">
          <div className="vitals-grid grid md:grid-cols-3 gap-6 mb-8">
            {vitals.map(vital => (
              <div key={vital.id} className="vital-card glass-effect rounded-lg p-4 text-center">
                <div className="vital-label text-sm font-medium text-gray-600 mb-1">{vital.label}</div>
                <div 
                  className="vital-value text-2xl font-bold text-gray-800 mb-1"
                  style={{ color: vital.color }}
                >
                  {vital.value}
                </div>
                <div className="vital-unit text-sm text-gray-500">{vital.unit}</div>
                <div className="vital-normal text-xs text-gray-400 mt-1">Normal: {vital.normal}</div>
              </div>
            ))}
          </div>

          <div className="scenarios-container glass-effect rounded-lg p-6">
            <div className="section-title flex items-center gap-2 text-gray-800 mb-6">
              <i className="fas fa-bolt text-blue-500"></i>
              <h3 className="text-lg font-semibold">Escenarios Clínicos</h3>
            </div>
            <div className="scenario-buttons flex flex-wrap gap-3 mb-6">
              {data.scenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => applyScenario(scenario.id)}
                  className="scenario-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  {scenario.name}
                </button>
              ))}
              <button
                onClick={resetVitals}
                className="scenario-btn bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                Restablecer
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Seleccione un escenario para simular diferentes condiciones clínicas.
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEvaluacionContent = () => {
    const data = medicalData.evaluacion;
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResults, setQuizResults] = useState(null);

    const startQuiz = (topic) => {
      setCurrentQuiz(topic);
      setQuizAnswers({});
      setQuizResults(null);
    };

    const submitQuiz = () => {
      const quizData = data.quizzes[currentCategory] || [];
      let score = 0;
      
      quizData.forEach((quiz, index) => {
        if (quizAnswers[index] !== undefined && quizAnswers[index] === quiz.correct) {
          score++;
        }
      });

      setQuizResults({
        score,
        total: quizData.length,
        percentage: Math.round((score / quizData.length) * 100)
      });
    };

    const renderQuiz = (topic) => {
      const quizData = data.quizzes[topic] || [];
      
      return (
        <div className="quiz-container glass-effect rounded-xl p-6">
          <div className="section-title flex items-center gap-2 text-gray-800 mb-6">
            <i className="fas fa-clipboard-check text-blue-500"></i>
            <h2 className="text-xl font-semibold">Evaluación: {topic}</h2>
          </div>
          
          {quizResults ? (
            <div className="results glass-effect rounded-lg p-6 text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">{quizResults.percentage}%</div>
              <div className="text-xl text-gray-700 mb-4">
                {quizResults.score} de {quizResults.total} respuestas correctas
              </div>
              <button 
                onClick={() => setQuizResults(null)}
                className="control-btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Volver a Intentar
              </button>
            </div>
          ) : (
            <>
              {quizData.map((quiz, index) => (
                <div key={index} className="quiz-question mb-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 mb-4">{quiz.question}</p>
                  <div className="space-y-2">
                    {quiz.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="radio" 
                          name={`quiz-${index}`} 
                          value={optIndex}
                          checked={quizAnswers[index] === optIndex}
                          onChange={() => setQuizAnswers(prev => ({ ...prev, [index]: optIndex }))}
                          className="text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                onClick={submitQuiz}
                className="control-btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Enviar Respuestas
              </button>
            </>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="page-header glass-effect p-6 rounded-xl">
          <h1 className="page-title text-2xl font-bold text-gray-800 flex items-center gap-3">
            <i className={`fas ${data.icon} text-blue-500`}></i>
            {data.title}
          </h1>
          <p className="page-description text-gray-600 mt-2">{data.description}</p>
        </div>

        {!currentQuiz ? (
          <div className="quiz-selection glass-effect rounded-xl p-6">
            <div className="section-title flex items-center gap-2 text-gray-800 mb-6">
              <i className="fas fa-tasks text-blue-500"></i>
              <h2 className="text-xl font-semibold">Seleccionar Evaluación</h2>
            </div>
            <div className="quiz-options grid md:grid-cols-2 gap-4">
              {Object.keys(data.quizzes).map(topic => (
                <button
                  key={topic}
                  onClick={() => startQuiz(topic)}
                  className="quiz-option glass-effect rounded-lg p-6 text-center hover:bg-gray-50 transition-all"
                >
                  <div className="text-3xl mb-3">
                    <i className={`fas ${medicalData[topic]?.icon || 'fa-question'}`}></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 capitalize">
                    {topic.replace('_', ' ')}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    {data.quizzes[topic].length} preguntas
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          renderQuiz(currentQuiz)
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (currentCategory) {
      case 'emergencias':
        return renderEmergenciasContent();
      case 'farmacologia':
        return renderFarmacologiaContent();
      case 'procedimientos':
        return renderProcedimientosContent();
      case 'enfermedades':
        return renderEnfermedadesContent();
      case 'nutricion':
        return renderNutricionContent();
      case 'recursos':
        return renderRecursosContent();
      case 'simulador':
        return renderSimuladorContent();
      case 'evaluacion':
        return renderEvaluacionContent();
      default:
        return (
          <div className="empty-state glass-effect">
            <i className="fas fa-exclamation-circle text-4xl text-gray-400"></i>
            <h3 className="text-lg font-semibold text-gray-700">Contenido no disponible</h3>
            <p className="text-gray-600">Lo sentimos, el contenido para esta categoría aún está en desarrollo.</p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="header glass-effect rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <i className="fas fa-heartbeat text-blue-600"></i>
              <span>App Médica</span>
            </h1>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full bg-white/80 hover:bg-white/100 backdrop-blur-sm transition-all"
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-gray-700`}></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="sidebar glass-effect rounded-xl p-6 md:w-64 flex-shrink-0">
            <div className="sidebar-header mb-6">
              <i className="fas fa-th-large text-blue-600 mr-2"></i>
              <h3 className="font-semibold text-gray-800">Funcionalidades</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(medicalData).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => activateCategory(key)}
                  className={`cat-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    currentCategory === key 
                      ? 'bg-white text-blue-600 font-semibold shadow-md' 
                      : 'text-gray-700 hover:bg-white/80'
                  }`}
                >
                  <i className={`fas ${data.icon}`}></i>
                  <span className="capitalize">{data.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="search-container mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch();
                  }}
                  placeholder="Buscar en la aplicación..."
                  className="search-input w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white/80 backdrop-blur-sm transition-all"
                />
                {searchTerm && (
                  <div className="search-suggestions absolute top-full left-0 right-0 mt-1 glass-effect rounded-b-xl p-4 max-h-60 overflow-y-auto z-10">
                    {searchHistory.length > 0 ? (
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-2">Búsquedas recientes</div>
                        {searchHistory.map((term, index) => (
                          <div
                            key={index}
                            onClick={() => setSearchTerm(term)}
                            className="p-2 hover:bg-gray-50 rounded cursor-pointer text-gray-700"
                          >
                            {term}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center py-4">No hay búsquedas recientes</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="main-content glass-effect rounded-xl p-6">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Notification */}
        <div 
          className={`notification fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm transition-all transform ${
            notification.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          } ${notification.type === 'success' ? 'bg-blue-600' : 'bg-red-600'} text-white`}
        >
          {notification.message}
        </div>
      </div>

      <style jsx>{`
        .glass-effect {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .dark {
          --bg: #1a1a2e;
          --bg-light: #16213e;
          --bg-dark: #0f3460;
          --text: #e1e1e1;
          --text-light: #b8b8b8;
          --text-lighter: #888;
          --border: #333;
          --border-light: #444;
          --primary: #4cc9f0;
          --primary-dark: #4361ee;
        }
        
        .dark .glass-effect {
          background: rgba(26, 26, 46, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dark .search-input {
          background: rgba(26, 26, 46, 0.5);
          border-color: #333;
          color: #e1e1e1;
        }
        
        .dark .search-input:focus {
          border-color: #4cc9f0;
          box-shadow: 0 0 0 3px rgba(76, 201, 240, 0.1);
        }
        
        .dark .search-suggestions {
          background: rgba(26, 26, 46, 0.9);
          border-color: #333;
        }
        
        .dark .suggestion-item {
          color: #e1e1e1;
          border-bottom-color: #333;
        }
        
        .dark .suggestion-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default MedicalApp;
```
