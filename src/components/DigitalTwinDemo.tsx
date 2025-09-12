import React, { useState, useEffect, useRef } from 'react';
import { Play, Shield, AlertTriangle, CheckCircle, XCircle, Clock, Map, User, Globe, Server } from 'lucide-react';

interface AttackEvent {
  time: string;
  location: string;
  user: string;
  status: 'attempting' | 'blocked' | 'detected';
  description: string;
  ip?: string;
  device?: string;
}

const DigitalTwinDemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<AttackEvent[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('00:00:00');
  const [stats, setStats] = useState({ attempted: 0, blocked: 0, detected: 0 });
  const [activeAttack, setActiveAttack] = useState<number | null>(null);
  const [showGlobe, setShowGlobe] = useState(false);
  const animationRef = useRef<number>();

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const simulateAttack = () => {
    setIsRunning(true);
    setEvents([]);
    setStats({ attempted: 0, blocked: 0, detected: 0 });
    setShowGlobe(true);

    const attackScenarios: AttackEvent[] = [
      {
        time: '00:00:02',
        location: 'Moscow, Russia',
        user: 'admin@company.com',
        status: 'blocked',
        description: 'Unusual geographic location - 3000+ miles from normal access pattern',
        ip: '192.168.1.105',
        device: 'Chrome/Windows'
      },
      {
        time: '00:00:05',
        location: 'New York, USA',
        user: 'jane.smith@company.com',
        status: 'attempting',
        description: 'Valid credentials but unusual time (2:00 AM local time)',
        ip: '104.28.245.63',
        device: 'Safari/macOS'
      },
      {
        time: '00:00:08',
        location: 'Tokyo, Japan',
        user: 'admin@company.com',
        status: 'blocked',
        description: 'Impossible travel detected - Previous login 5 mins ago in London',
        ip: '210.140.10.1',
        device: 'Firefox/Linux'
      },
      {
        time: '00:00:12',
        location: 'London, UK',
        user: 'john.doe@company.com',
        status: 'detected',
        description: 'Multiple failed attempts followed by success - Potential credential stuffing',
        ip: '86.150.25.78',
        device: 'Android/Chrome'
      },
      {
        time: '00:00:15',
        location: 'Beijing, China',
        user: 'service-account@company.com',
        status: 'blocked',
        description: 'Service account accessing from unrecognized country - Flagged as high risk',
        ip: '118.144.82.9',
        device: 'Python/Requests'
      },
      {
        time: '00:00:18',
        location: 'San Francisco, USA',
        user: 'jane.smith@company.com',
        status: 'attempting',
        description: 'Valid login but from Tor network - Additional verification required',
        ip: '199.249.230.78',
        device: 'Tor Browser'
      }
    ];

    let time = 0;
    attackScenarios.forEach((event, index) => {
      setTimeout(() => {
        setActiveAttack(index);
        setEvents(prev => [...prev, event]);
        setCurrentTime(event.time);
        
        setStats(prev => ({
          attempted: prev.attempted + 1,
          blocked: prev.blocked + (event.status === 'blocked' ? 1 : 0),
          detected: prev.detected + (event.status === 'detected' ? 1 : 0)
        }));

        // Animate the globe effect
        animateGlobeEffect(index);

        if (index === attackScenarios.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            setActiveAttack(null);
          }, 2000);
        }
      }, time);
      time += 3000; // 3 seconds between events
    });
  };

  const animateGlobeEffect = (index: number) => {
    const start = Date.now();
    const duration = 1000;
    
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // You could add visual effects here like pulsing circles, etc.
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  const getStatusIcon = (status: AttackEvent['status']) => {
    switch (status) {
      case 'blocked': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'detected': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'attempting': return <Shield className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: AttackEvent['status']) => {
    switch (status) {
      case 'blocked': return 'bg-red-50 border-red-200';
      case 'detected': return 'bg-yellow-50 border-yellow-200';
      case 'attempting': return 'bg-blue-50 border-blue-200';
      default: return '';
    }
  };

  const getStatusText = (status: AttackEvent['status']) => {
    switch (status) {
      case 'blocked': return 'Blocked';
      case 'detected': return 'Detected';
      case 'attempting': return 'Monitoring';
      default: return '';
    }
  };

  return (
    <div id="simulation" className="py-16 bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-teal-100 px-4 py-2 rounded-full text-sm font-medium text-teal-800 mb-4">
            <Shield className="w-4 h-4" />
            <span>LIVE DEMONSTRATION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Digital Twin <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Attack Simulation</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch our AI system detect and block stolen credential attacks in real-time with zero false positives
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Simulation Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">Live Attack Simulation</h3>
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{currentTime}</span>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-red-50 p-4 rounded-lg text-center border border-red-100">
                  <div className="text-2xl font-bold text-red-600">{stats.attempted}</div>
                  <div className="text-sm text-red-700 font-medium">Attempted</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-100">
                  <div className="text-2xl font-bold text-yellow-600">{stats.detected}</div>
                  <div className="text-sm text-yellow-700 font-medium">Detected</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                  <div className="text-2xl font-bold text-green-600">{stats.blocked}</div>
                  <div className="text-sm text-green-700 font-medium">Blocked</div>
                </div>
              </div>

              <button
                onClick={simulateAttack}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Play className="w-5 h-5" />
                <span>{isRunning ? 'Simulation Running...' : 'Start Attack Simulation'}</span>
              </button>
            </div>

            {/* Event Log */}
            <div className="bg-gray-50 rounded-xl p-4 h-96 overflow-y-auto border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <Server className="w-4 h-4 mr-2" />
                Security Event Log
              </h4>
              <div className="space-y-3">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all duration-300 transform hover:scale-[1.01] ${getStatusColor(event.status)} ${
                      activeAttack === index ? 'ring-2 ring-teal-400 scale-[1.02]' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(event.status)}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-900">{event.user}</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'blocked' ? 'bg-red-100 text-red-800' :
                              event.status === 'detected' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {getStatusText(event.status)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{event.time}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Map className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                        
                        {event.ip && (
                          <div className="text-xs text-gray-500 mb-2">
                            IP: {event.ip} • {event.device}
                          </div>
                        )}
                        
                        <p className="text-sm text-gray-700 bg-white/50 p-2 rounded border">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {events.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No security events detected</p>
                    <p className="text-sm mt-1">Start simulation to see real-time threat detection</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-teal-600" />
                How Our AI Detects Attacks
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-teal-600 font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Behavioral Analysis</h4>
                    <p className="text-gray-600">Machine learning models establish baseline behavior patterns for each user and flag anomalies in real-time with 99.8% accuracy</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-teal-600 font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Geographic Intelligence</h4>
                    <p className="text-gray-600">Advanced algorithms detect impossible travel scenarios and flag logins from high-risk locations before they can cause damage</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-teal-600 font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Device Fingerprinting</h4>
                    <p className="text-gray-600">Unique device identification combined with threat intelligence to detect compromised devices and suspicious configurations</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-teal-600 font-bold text-lg">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Real-time Response</h4>
                    <p className="text-gray-600">Automated threat response with customizable policies - from multi-factor authentication challenges to complete access blocking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Ready Card */}
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                Enterprise Ready
              </h3>
              <p className="mb-6 opacity-90">Deployed by Fortune 500 companies with 99.99% uptime SLA</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">≤100ms</div>
                  <div className="text-sm opacity-80">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">0.01%</div>
                  <div className="text-sm opacity-80">False Positives</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">1M+</div>
                  <div className="text-sm opacity-80">Events/Second</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm opacity-80">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Demo Instructions */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Demo Instructions
              </h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Click "Start Attack Simulation" to begin</li>
                <li>• Watch real-time attack detection and blocking</li>
                <li>• Observe different attack patterns and responses</li>
                <li>• Notice the detailed security event logging</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Real-world Impact Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Real-world Impact</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">98% Reduction</h4>
              <p className="text-gray-600 text-sm">In account takeover incidents</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">70% Faster</h4>
              <p className="text-gray-600 text-sm">Threat detection response time</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">100% Compliance</h4>
              <p className="text-gray-600 text-sm">With regulatory requirements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinDemo;