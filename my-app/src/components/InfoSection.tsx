interface InfoSectionProps {
  darkMode: boolean;
}

const TOPICS = [
  {
    title: 'What is Pre-Competition Anxiety?',
    content:
      'Pre-competition anxiety is the nervousness, worry, or fear you feel before a competition. Almost every athlete experiences it — even professional ones. It is your body\'s way of getting ready for something important. A little anxiety can actually help you perform better by making you more alert and focused.',
  },
  {
    title: 'Why Does It Happen?',
    content:
      'Your brain treats competitions as high-stakes situations. It releases adrenaline and cortisol — chemicals that prepare your body for action. This "fight or flight" response can cause a racing heart, butterflies in your stomach, sweaty palms, or trouble sleeping. These are all normal reactions.',
  },
  {
    title: 'Breathing Exercises',
    content:
      'Deep, slow breathing is one of the fastest ways to calm your nervous system. The 4-4-6 technique (breathe in for 4 seconds, hold for 4, breathe out for 6) activates your body\'s relaxation response. Try to breathe from your belly, not your chest. Even 2 minutes of focused breathing can make a big difference.',
  },
  {
    title: 'Visualization',
    content:
      'Visualization means creating a mental picture of yourself performing well. Athletes who regularly visualize success actually perform better — research has shown that your brain activates similar pathways whether you physically do something or vividly imagine it. Picture every detail: the venue, your movements, the feeling of confidence.',
  },
  {
    title: 'Positive Self-Talk',
    content:
      'The way you talk to yourself matters. Replace negative thoughts like "What if I fail?" with "I have prepared for this." Positive self-talk isn\'t about lying to yourself — it\'s about reminding yourself of the truth: you have trained, you are capable, and you can handle whatever happens.',
  },
  {
    title: '5-4-3-2-1 Grounding',
    content:
      'When anxiety feels overwhelming, grounding brings you back to the present moment. Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This simple exercise shifts your brain\'s focus away from worried thoughts and into your immediate surroundings.',
  },
  {
    title: 'When to Talk to Someone',
    content:
      'While some anxiety before competitions is normal, it\'s important to talk to a trusted adult (parent, coach, or counselor) if: anxiety is affecting your daily life, you\'re having trouble eating or sleeping for days before events, you want to quit a sport you used to love because of anxiety, or you feel sad or hopeless. Asking for help is a sign of strength, not weakness.',
  },
];

export default function InfoSection({ darkMode }: InfoSectionProps) {
  const cardBg = darkMode ? 'bg-dark-surface' : 'bg-light-surface';
  const cardBorder = darkMode ? 'border-dark-card' : 'border-gray-200';
  const muted = darkMode ? 'text-dark-muted' : 'text-light-muted';

  return (
    <div className="flex-1 flex flex-col gap-6 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Learn About Anxiety</h1>
        <p className={muted}>
          Understanding anxiety is the first step to managing it
        </p>
      </div>

      <div className="space-y-4">
        {TOPICS.map((topic, i) => (
          <details
            key={i}
            className={`rounded-2xl border overflow-hidden group ${cardBg} ${cardBorder}`}
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-lg list-none">
              <span>{topic.title}</span>
              <svg
                className="w-5 h-5 transition-transform group-open:rotate-180 shrink-0 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className={`px-5 pb-5 leading-relaxed ${muted}`}>
              {topic.content}
            </div>
          </details>
        ))}
      </div>

      {/* Crisis resources */}
      <div className={`rounded-2xl border p-6 space-y-3 ${cardBg} ${cardBorder}`}>
        <h2 className="text-lg font-semibold">Need to talk to someone?</h2>
        <p className={muted}>
          If you are struggling, these resources can help:
        </p>
        <ul className="space-y-2 text-calm-400">
          <li>
            <strong>Crisis Text Line:</strong> Text HOME to 741741
          </li>
          <li>
            <strong>Kids Help Phone:</strong> 1-800-668-6868
          </li>
          <li>
            <strong>Talk to a trusted adult:</strong> parent, coach, teacher, or counselor
          </li>
        </ul>
      </div>
    </div>
  );
}
