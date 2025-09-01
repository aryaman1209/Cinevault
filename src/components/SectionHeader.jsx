export default function SectionHeader({ title, aside }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      {aside && <div>{aside}</div>}
    </div>
  );
}
