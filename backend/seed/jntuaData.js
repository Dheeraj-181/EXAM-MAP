const sampleSubjects = [
  {
    name: 'Operating Systems',
    code: '20A05501T',
    credits: 3,
    totalUnits: 5,
    color: '#6558F5',
    icon: 'Cpu',
    difficulty: 'Hard',
    description: 'Process management, concurrency, CPU scheduling, deadlocks, and virtual memory systems.',
    units: [
      {
        unit: 1,
        unitTitle: 'Unit 1: OS Overview & Process Management',
        topics: [
          { title: 'Operating System Functions, System Calls, and Dual-Mode Operation', priority: 'Medium', estimatedHours: 2, status: 'Completed' },
          { title: 'Process Concept, Process Control Block (PCB), Process State Transitions', priority: 'High', estimatedHours: 3, status: 'Completed' },
          { title: 'Inter-Process Communication (IPC) - Pipes, Message Queues, Shared Memory', priority: 'High', estimatedHours: 2.5, status: 'In Progress' },
          { title: 'Thread Models, Multithreading, and Thread Libraries (POSIX Pthreads)', priority: 'Medium', estimatedHours: 2, status: 'Not Started' }
        ]
      },
      {
        unit: 2,
        unitTitle: 'Unit 2: CPU Scheduling & Synchronization',
        topics: [
          { title: 'CPU Scheduling Criteria & Preemptive vs Non-Preemptive Scheduling', priority: 'High', estimatedHours: 2, status: 'Completed' },
          { title: 'Scheduling Algorithms: FCFS, SJF, Priority, and Round Robin (RR)', priority: 'High', estimatedHours: 3, status: 'Completed' },
          { title: 'Critical Section Problem & Peterson Solution', priority: 'High', estimatedHours: 2.5, status: 'In Progress' },
          { title: 'Semaphores, Mutex Locks, and Classic Synchronization Problems (Dining Philosophers)', priority: 'High', estimatedHours: 3, status: 'Not Started' }
        ]
      },
      {
        unit: 3,
        unitTitle: 'Unit 3: Deadlocks & Prevention',
        topics: [
          { title: 'Deadlock Characterization & 4 Necessary Conditions', priority: 'High', estimatedHours: 2, status: 'Not Started' },
          { title: 'Deadlock Prevention and Avoidance Strategies', priority: 'High', estimatedHours: 2.5, status: 'Not Started' },
          { title: "Banker's Algorithm for Resource Allocation & Safety Check", priority: 'High', estimatedHours: 3, status: 'Not Started' },
          { title: 'Deadlock Detection Algorithms and Recovery Mechanisms', priority: 'Medium', estimatedHours: 2, status: 'Not Started' }
        ]
      },
      {
        unit: 4,
        unitTitle: 'Unit 4: Memory Management & Virtual Memory',
        topics: [
          { title: 'Logical vs Physical Address Space and Dynamic Loading/Linking', priority: 'Medium', estimatedHours: 2, status: 'Not Started' },
          { title: 'Contiguous Memory Allocation, Fragmentation, and Compaction', priority: 'Medium', estimatedHours: 2, status: 'Not Started' },
          { title: 'Paging Architecture, Page Table Structure, and TLB (Translation Lookaside Buffer)', priority: 'High', estimatedHours: 3.5, status: 'Not Started' },
          { title: 'Virtual Memory, Demand Paging, and Page Fault Handling', priority: 'High', estimatedHours: 3, status: 'Not Started' },
          { title: 'Page Replacement Algorithms: FIFO, Optimal, and LRU', priority: 'High', estimatedHours: 3, status: 'Not Started' }
        ]
      },
      {
        unit: 5,
        unitTitle: 'Unit 5: Storage & File System Implementation',
        topics: [
          { title: 'File Concept, Access Methods, and Directory Structures', priority: 'Low', estimatedHours: 1.5, status: 'Not Started' },
          { title: 'File System Mounting, Allocation Methods (Contiguous, Linked, Indexed)', priority: 'Medium', estimatedHours: 2.5, status: 'Not Started' },
          { title: 'Disk Scheduling Algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK', priority: 'High', estimatedHours: 2.5, status: 'Not Started' },
          { title: 'RAID Levels and Mass Storage Structure', priority: 'Medium', estimatedHours: 2, status: 'Not Started' }
        ]
      }
    ]
  },
  {
    name: 'Database Management Systems',
    code: '20A05502T',
    credits: 3,
    totalUnits: 5,
    color: '#35B8A6',
    icon: 'Database',
    difficulty: 'Medium',
    description: 'Relational data models, SQL queries, normalization theories, transaction ACID properties, and indexing.',
    units: [
      {
        unit: 1,
        unitTitle: 'Unit 1: Database Architecture & ER Modeling',
        topics: [
          { title: 'Database System Architecture & Three-Schema Architecture', priority: 'Medium', estimatedHours: 2, status: 'Completed' },
          { title: 'Entity-Relationship (E-R) Modeling, Entities, Attributes, Relationships', priority: 'High', estimatedHours: 3, status: 'Completed' },
          { title: 'Extended E-R Features: Specialization, Generalization, Aggregation', priority: 'Medium', estimatedHours: 2, status: 'Completed' },
          { title: 'Converting E-R Diagrams into Relational Database Schemas', priority: 'High', estimatedHours: 2.5, status: 'In Progress' }
        ]
      },
      {
        unit: 2,
        unitTitle: 'Unit 2: Relational Algebra & Advanced SQL',
        topics: [
          { title: 'Relational Algebra Operations: Select, Project, Rename, Cartesian Product', priority: 'High', estimatedHours: 2.5, status: 'Completed' },
          { title: 'Set Operations and Joins: Natural Join, Theta Join, Outer Joins', priority: 'High', estimatedHours: 3, status: 'Completed' },
          { title: 'Complex SQL Queries: Aggregates, Group By, Having, Subqueries', priority: 'High', estimatedHours: 3.5, status: 'In Progress' },
          { title: 'Views, Integrity Constraints, Triggers, and Stored Procedures', priority: 'Medium', estimatedHours: 2.5, status: 'Not Started' }
        ]
      },
      {
        unit: 3,
        unitTitle: 'Unit 3: Schema Refinement & Normalization',
        topics: [
          { title: 'Functional Dependencies and Closure of Attribute Sets', priority: 'High', estimatedHours: 3, status: 'Not Started' },
          { title: 'First Normal Form (1NF) & Second Normal Form (2NF)', priority: 'Medium', estimatedHours: 2, status: 'Not Started' },
          { title: 'Third Normal Form (3NF) & Boyce-Codd Normal Form (BCNF)', priority: 'High', estimatedHours: 3.5, status: 'Not Started' },
          { title: 'Multi-Valued Dependencies and Fourth Normal Form (4NF)', priority: 'Medium', estimatedHours: 2, status: 'Not Started' },
          { title: 'Lossless-Join Decomposition & Dependency Preserving Properties', priority: 'High', estimatedHours: 2.5, status: 'Not Started' }
        ]
      },
      {
        unit: 4,
        unitTitle: 'Unit 4: Transaction Processing & Concurrency',
        topics: [
          { title: 'Transaction Concept, States, and ACID Properties', priority: 'High', estimatedHours: 2, status: 'Not Started' },
          { title: 'Conflict and View Serializability & Testing for Serializability', priority: 'High', estimatedHours: 3, status: 'Not Started' },
          { title: 'Two-Phase Locking (2PL) Protocol - Strict, Rigorous, Conservative', priority: 'High', estimatedHours: 2.5, status: 'Not Started' },
          { title: 'Timestamp-Based and Validation-Based Concurrency Protocols', priority: 'Medium', estimatedHours: 2, status: 'Not Started' }
        ]
      },
      {
        unit: 5,
        unitTitle: 'Unit 5: Indexing, B-Trees & Query Optimization',
        topics: [
          { title: 'File Organization: Heap, Sorted, and Hash Files', priority: 'Low', estimatedHours: 1.5, status: 'Not Started' },
          { title: 'Primary, Secondary, and Clustered Indexes', priority: 'Medium', estimatedHours: 2, status: 'Not Started' },
          { title: 'B-Tree and B+ Tree Indexing Structures with Insertion/Deletion', priority: 'High', estimatedHours: 3, status: 'Not Started' },
          { title: 'Overview of Query Evaluation & Optimization Steps', priority: 'Medium', estimatedHours: 2, status: 'Not Started' }
        ]
      }
    ]
  },
  {
    name: 'Computer Networks',
    code: '20A05503T',
    credits: 3,
    totalUnits: 5,
    color: '#3B82F6',
    icon: 'Network',
    difficulty: 'Medium',
    description: 'Protocol layering, routing protocols, flow and congestion control, TCP/IP, and network security.',
    units: [
      {
        unit: 1,
        unitTitle: 'Unit 1: Introduction & Physical Layer',
        topics: [
          { title: 'Data Communications, Network Types: LAN, MAN, WAN, PAN', priority: 'Low', estimatedHours: 1.5, status: 'Completed' },
          { title: 'OSI Reference Model vs TCP/IP Protocol Suite Comparison', priority: 'High', estimatedHours: 2.5, status: 'Completed' },
          { title: 'Transmission Media: Twisted Pair, Coaxial, Fiber Optics, Wireless', priority: 'Medium', estimatedHours: 2, status: 'Completed' }
        ]
      },
      {
        unit: 2,
        unitTitle: 'Unit 2: Data Link Layer & MAC Sublayer',
        topics: [
          { title: 'Design Issues, Framing Techniques, Error Detection (CRC, Checksum)', priority: 'High', estimatedHours: 2.5, status: 'In Progress' },
          { title: 'Elementary Data Link Protocols: Stop-and-Wait ARQ, Go-Back-N, Selective Repeat', priority: 'High', estimatedHours: 3.5, status: 'Not Started' },
          { title: 'Medium Access Control: Pure ALOHA, Slotted ALOHA, CSMA/CD, CSMA/CA', priority: 'High', estimatedHours: 3, status: 'Not Started' }
        ]
      },
      {
        unit: 3,
        unitTitle: 'Unit 3: Network Layer & IP Addressing',
        topics: [
          { title: 'IPv4 Header Format, Subnetting, Supernetting, and CIDR Calculations', priority: 'High', estimatedHours: 3.5, status: 'Not Started' },
          { title: 'Routing Algorithms: Distance Vector (Bellman-Ford) & Link State (Dijkstra)', priority: 'High', estimatedHours: 3.5, status: 'Not Started' },
          { title: 'Supporting Protocols: ARP, RARP, ICMP, and Introduction to IPv6', priority: 'Medium', estimatedHours: 2, status: 'Not Started' }
        ]
      },
      {
        unit: 4,
        unitTitle: 'Unit 4: Transport Layer Protocols',
        topics: [
          { title: 'Transport Layer Services: Port Numbers, Multiplexing, UDP Header', priority: 'Medium', estimatedHours: 2, status: 'Not Started' },
          { title: 'TCP Connection Management: Three-Way Handshake & Termination', priority: 'High', estimatedHours: 2.5, status: 'Not Started' },
          { title: 'TCP Congestion Control: Slow Start, Congestion Avoidance, Fast Retransmit', priority: 'High', estimatedHours: 3, status: 'Not Started' }
        ]
      },
      {
        unit: 5,
        unitTitle: 'Unit 5: Application Layer & Security',
        topics: [
          { title: 'Domain Name System (DNS), Architecture, and Query Resolution', priority: 'Medium', estimatedHours: 2, status: 'Not Started' },
          { title: 'Electronic Mail (SMTP, POP3, IMAP) and HTTP / HTTPS Protocols', priority: 'Medium', estimatedHours: 2, status: 'Not Started' },
          { title: 'Basics of Cryptography: Symmetric vs Asymmetric (RSA Algorithm), Firewalls', priority: 'High', estimatedHours: 2.5, status: 'Not Started' }
        ]
      }
    ]
  },
  {
    name: 'Software Engineering',
    code: '20A05504T',
    credits: 3,
    totalUnits: 5,
    color: '#EC4899',
    icon: 'Layers',
    difficulty: 'Easy',
    description: 'Software process models, agile development, requirements engineering, testing and quality metrics.',
    units: [
      {
        unit: 1,
        unitTitle: 'Unit 1: Process Models & Agile',
        topics: [
          { title: 'The Changing Nature of Software, SDLC Phases', priority: 'Low', estimatedHours: 1.5, status: 'Completed' },
          { title: 'Prescriptive Models: Waterfall, Incremental, RAD, Evolutionary (Spiral)', priority: 'Medium', estimatedHours: 2, status: 'Completed' },
          { title: 'Agile Methodology: Scrum Framework, Sprint Planning, User Stories', priority: 'High', estimatedHours: 2.5, status: 'Completed' }
        ]
      },
      {
        unit: 2,
        unitTitle: 'Unit 2: Requirements Engineering',
        topics: [
          { title: 'Requirements Elicitation, Analysis, Specification (SRS Standard IEEE 830)', priority: 'High', estimatedHours: 2.5, status: 'Completed' },
          { title: 'Use Case Modeling, Activity Diagrams, and Data Flow Diagrams (DFDs)', priority: 'High', estimatedHours: 2.5, status: 'In Progress' }
        ]
      },
      {
        unit: 3,
        unitTitle: 'Unit 3: Design Concepts & Architecture',
        topics: [
          { title: 'Design Concepts: Abstraction, Modularity, Cohesion and Coupling', priority: 'High', estimatedHours: 2.5, status: 'Not Started' },
          { title: 'Architectural Styles, Component-Level Design, User Interface Design Principles', priority: 'Medium', estimatedHours: 2, status: 'Not Started' }
        ]
      },
      {
        unit: 4,
        unitTitle: 'Unit 4: Software Testing Strategies',
        topics: [
          { title: 'Testing Fundamentals: Verification vs Validation, Test Cases Design', priority: 'High', estimatedHours: 2, status: 'Not Started' },
          { title: 'White-Box Testing: Basis Path, Cyclomatic Complexity, Control Structure', priority: 'High', estimatedHours: 3, status: 'Not Started' },
          { title: 'Black-Box Testing: Equivalence Partitioning, Boundary Value Analysis', priority: 'High', estimatedHours: 2.5, status: 'Not Started' },
          { title: 'Unit, Integration, Regression, and System Testing', priority: 'Medium', estimatedHours: 2, status: 'Not Started' }
        ]
      },
      {
        unit: 5,
        unitTitle: 'Unit 5: Project Management & Quality',
        topics: [
          { title: 'Effort Estimation using COCOMO Model and Function Points', priority: 'High', estimatedHours: 2.5, status: 'Not Started' },
          { title: 'Risk Management: RMMM Plan, Software Quality Assurance, CMMI Levels', priority: 'Medium', estimatedHours: 2, status: 'Not Started' }
        ]
      }
    ]
  }
];

const seedUserData = async (userId) => {
  const Subject = require('../models/Subject');
  const Topic = require('../models/Topic');
  const StudyPlan = require('../models/StudyPlan');
  const Exam = require('../models/Exam');

  try {
    const existingSubject = await Subject.findOne({ user: userId });
    if (existingSubject) return; // Already seeded

    const createdSubjects = [];
    const createdTopics = [];

    // Exam target dates spaced out
    const examDates = [
      new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
      new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
      new Date(Date.now() + 26 * 24 * 60 * 60 * 1000), // 26 days from now
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    ];

    for (let i = 0; i < sampleSubjects.length; i++) {
      const s = sampleSubjects[i];
      const subjectDoc = await Subject.create({
        user: userId,
        name: s.name,
        code: s.code,
        credits: s.credits,
        totalUnits: s.totalUnits,
        color: s.color,
        icon: s.icon,
        difficulty: s.difficulty,
        targetExamDate: examDates[i],
        description: s.description,
      });
      createdSubjects.push(subjectDoc);

      for (const u of s.units) {
        for (const t of u.topics) {
          const topicDoc = await Topic.create({
            user: userId,
            subject: subjectDoc._id,
            unit: u.unit,
            unitTitle: u.unitTitle,
            title: t.title,
            priority: t.priority,
            estimatedHours: t.estimatedHours,
            status: t.status,
            completedAt: t.status === 'Completed' ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) : null,
            notes: `Important for university semester questions. Review textbook unit questions.`,
          });
          createdTopics.push(topicDoc);
        }
      }

      // Create an Exam record
      await Exam.create({
        user: userId,
        subject: subjectDoc._id,
        examName: `${s.name} - Semester Theory Exam`,
        examDate: examDates[i],
        examTime: '10:00 AM - 01:00 PM',
        targetMarks: 70,
        venue: 'Examination Block - Hall 2',
        notes: 'Covers all 5 units according to university curriculum guidelines.',
      });
    }

    // Create 3 realistic study plan sessions
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (createdSubjects.length > 0 && createdTopics.length > 0) {
      await StudyPlan.create({
        user: userId,
        subject: createdSubjects[0]._id,
        topic: createdTopics[2]._id,
        title: 'Revise Inter-Process Communication & Message Queues',
        date: todayStr,
        startTime: '17:30',
        durationMinutes: 90,
        status: 'In Progress',
        notes: 'Solve numerical problems on shared memory and buffer sizing',
        pomodoroCyclesCompleted: 2,
      });

      await StudyPlan.create({
        user: userId,
        subject: createdSubjects[1]._id,
        topic: createdTopics[7]._id,
        title: 'Practice SQL Subqueries and Nested Aggregations',
        date: todayStr,
        startTime: '20:00',
        durationMinutes: 60,
        status: 'Planned',
        notes: 'Write queries for student-course enrollment database',
        pomodoroCyclesCompleted: 0,
      });

      await StudyPlan.create({
        user: userId,
        subject: createdSubjects[2]._id,
        topic: createdTopics[12]._id,
        title: 'Solve CRC and Sliding Window numericals',
        date: tomorrowStr,
        startTime: '16:00',
        durationMinutes: 120,
        status: 'Planned',
        notes: 'Important numerical concept for semester examination',
        pomodoroCyclesCompleted: 0,
      });
    }

    console.log(`[ExamMap Seed] Successfully seeded default curriculum data for user: ${userId}`);
  } catch (error) {
    console.error('[ExamMap Seed] Failed to seed default data:', error.message);
  }
};

module.exports = { sampleSubjects, seedUserData };
