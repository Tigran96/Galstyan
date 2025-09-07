import { Card } from './Card';

export const Feature = ({ icon, title, desc, CONFIG }) => (
  <Card CONFIG={CONFIG}>
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/0">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-sky-200">{desc}</p>
      </div>
    </div>
  </Card>
);
