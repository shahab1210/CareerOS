import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Mic, MicOff, Video, VideoOff, Settings, AlertCircle, 
  Send, Award, CheckCircle2, ArrowRight, RotateCcw, Sparkles, Loader2 
} from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Question {
  id: number;
  category: string;
  question: string;
  expectedKeyPoints?: string[];
}

interface EvaluationResult {
  score: number;
  technicalAccuracy: number;
  communicationClarity: number;
  strengths: string[];
  improvements: string[];
  idealAnswerSummary: string;
}

export default function MockInterviewPage() {
  const [role, setRole] = useState('Full Stack Engineer');
  const [difficulty, setDifficulty] = useState('JUNIOR');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User media (Webcam / Mic)
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Answer & Evaluation
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<EvaluationResult | null>(null);
  const [completedEvaluations, setCompletedEvaluations] = useState<Record<number, EvaluationResult>>({});

  // Media permissions toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micActive });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        toast.error('Could not access camera. Please allow permissions.');
      }
    }
  };

  const toggleMic = () => {
    setMicActive(prev => !prev);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startInterview = async () => {
    setIsLoadingQuestions(true);
    try {
      const res = await api.get(`/mock-interview/questions?role=${encodeURIComponent(role)}&difficulty=${difficulty}`);
      const data = res.data.data;
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setUserAnswer('');
        setCurrentFeedback(null);
        setCompletedEvaluations({});
        setIsSessionActive(true);
        // Try enabling camera automatically for realistic feel
        toggleCamera().catch(() => {});
        toast.success(`Started interview for ${role}!`);
      } else {
        toast.error('Failed to load questions. Please retry.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to start interview.');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please speak or type your response before submitting.');
      return;
    }

    const currentQuestion = questions[currentIndex];
    setIsEvaluating(true);

    try {
      const res = await api.post('/mock-interview/evaluate', {
        role,
        question: currentQuestion.question,
        userAnswer,
        expectedKeyPoints: currentQuestion.expectedKeyPoints,
      });

      const feedback = res.data.data as EvaluationResult;
      setCurrentFeedback(feedback);
      setCompletedEvaluations(prev => ({ ...prev, [currentIndex]: feedback }));
      toast.success('Response evaluated!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to evaluate answer.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setCurrentFeedback(null);
    } else {
      toast.success('Interview completed! Review your feedback summary.');
    }
  };

  const handleEndSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setCameraActive(false);
    setIsSessionActive(false);
  };

  const currentQ = questions[currentIndex];
  const isFinished = currentIndex === questions.length - 1 && currentFeedback !== null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">AI Mock Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Simulate realistic technical and behavioral interviews with real-time feedback powered by Google Gemini.
          </p>
        </div>

        {isSessionActive && (
          <Button variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10" onClick={handleEndSession}>
            End Session
          </Button>
        )}
      </div>

      {!isSessionActive ? (
        /* Configuration & Setup Screen */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Configure Your Interview Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Target Engineering Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Frontend Developer (React/TS)">Frontend Developer (React/TS)</option>
                  <option value="Backend Developer (Node/Go/Java)">Backend Developer (Node/Go/Java)</option>
                  <option value="Data Engineer & Analytics">Data Engineer & Analytics</option>
                  <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Seniority / Target Level
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDifficulty('JUNIOR')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      difficulty === 'JUNIOR'
                        ? 'border-accent bg-accent/10 font-bold text-accent'
                        : 'border-border bg-surface text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    <div className="text-base font-semibold">Campus / Entry-Level (SDE-1)</div>
                    <div className="text-xs text-muted-foreground mt-1">Fundamentals, DSA, Clean Code, STAR method</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDifficulty('MID')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      difficulty === 'MID'
                        ? 'border-accent bg-accent/10 font-bold text-accent'
                        : 'border-border bg-surface text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    <div className="text-base font-semibold">Mid-Level Engineer</div>
                    <div className="text-xs text-muted-foreground mt-1">System Design, Concurrency, Production Debugging</div>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  size="lg" 
                  variant="accent" 
                  disabled={isLoadingQuestions}
                  onClick={startInterview}
                  className="gap-2"
                >
                  {isLoadingQuestions ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Generating Interview Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Start AI Interview
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips Card */}
          <Card className="bg-surface/50 border-dashed">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" /> How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>• <strong>Tailored to your skills:</strong> Questions dynamically adjust using your verified CareerOS skill profile.</p>
              <p>• <strong>Behavioral & Technical:</strong> Combines practical problem-solving with STAR behavioral criteria.</p>
              <p>• <strong>Instant AI Scorecard:</strong> Receive feedback on technical depth, delivery clarity, and optimal responses.</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Active Interview Session Screen */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Video Preview & Question Display */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Camera View Card */}
            <Card className="overflow-hidden relative bg-black/95 aspect-video flex items-center justify-center rounded-2xl shadow-xl border-border">
              {cameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover -scale-x-100" 
                />
              ) : (
                <div className="text-center text-muted-foreground space-y-2">
                  <VideoOff className="w-12 h-12 mx-auto opacity-50" />
                  <p className="text-sm">Camera preview is off</p>
                </div>
              )}

              {/* Floating Camera & Mic Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-lg">
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`p-2.5 rounded-full transition-colors ${
                    cameraActive ? 'bg-accent/20 text-accent' : 'bg-surface-muted text-muted-foreground'
                  }`}
                  title={cameraActive ? 'Turn camera off' : 'Turn camera on'}
                >
                  {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
                </button>

                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2.5 rounded-full transition-colors ${
                    micActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface-muted text-muted-foreground'
                  }`}
                  title={micActive ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {micActive ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
              </div>

              {/* Question Indicator Badge */}
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold border border-border">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </Card>

            {/* Current Question */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                    {currentQ?.category || 'Technical Question'}
                  </span>
                </div>
                <CardTitle className="text-xl md:text-2xl mt-3 font-semibold text-foreground">
                  {currentQ?.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentQ?.expectedKeyPoints && (
                  <div className="bg-surface-muted/50 p-3 rounded-lg text-xs text-muted-foreground space-y-1">
                    <span className="font-semibold block text-foreground">Interviewer is listening for:</span>
                    <ul className="list-disc list-inside">
                      {currentQ.expectedKeyPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Candidate Input & Live AI Evaluation */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Response</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your response here, or outline your answer bullet-by-bullet..."
                  className="w-full flex-1 min-h-[160px] p-3 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="accent"
                    onClick={handleEvaluateAnswer}
                    disabled={isEvaluating || !userAnswer.trim()}
                    className="gap-2"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Answer...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Submit for Review
                      </>
                    )}
                  </Button>

                  {currentFeedback && currentIndex < questions.length - 1 && (
                    <Button variant="outline" onClick={handleNextQuestion} className="gap-2">
                      Next Question <ArrowRight size={16} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Feedback Card */}
            {currentFeedback && (
              <Card className="border-accent/30 bg-surface shadow-lg animate-in slide-in-from-bottom-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" /> AI Evaluation Scorecard
                    </CardTitle>
                    <span className="text-2xl font-bold text-accent">
                      {currentFeedback.score}/100
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-surface-muted rounded-lg">
                      <div className="text-muted-foreground">Technical Depth</div>
                      <div className="text-base font-bold text-foreground mt-0.5">
                        {currentFeedback.technicalAccuracy}%
                      </div>
                    </div>
                    <div className="p-2.5 bg-surface-muted rounded-lg">
                      <div className="text-muted-foreground">Clarity</div>
                      <div className="text-base font-bold text-foreground mt-0.5">
                        {currentFeedback.communicationClarity}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-emerald-400 block mb-1">Key Strengths:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                      {currentFeedback.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-amber-400 block mb-1">Areas to Improve:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                      {currentFeedback.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-accent/5 rounded-lg border border-accent/20">
                    <span className="font-semibold text-accent block mb-1">Senior Model Answer:</span>
                    <p className="text-muted-foreground italic leading-relaxed">
                      "{currentFeedback.idealAnswerSummary}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
