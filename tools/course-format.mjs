/* Hoe data/course.js op schijf staat: één atoom (of thema, of tekst) per
 * regel. Even klein als volledig geminimaliseerde JSON — de telefoon laadt
 * het bestand bij elke start — maar een wijziging aan één woord blijft in git
 * één regel. */

const line = v => JSON.stringify(v);

export function serializeCourse(course) {
  const keys = Object.keys(course);
  const parts = keys.map(k => {
    const v = course[k];
    if (Array.isArray(v)) return `${line(k)}: [\n${v.map(line).join(',\n')}\n]`;
    if (v && typeof v === 'object') {
      return `${line(k)}: {\n${Object.entries(v).map(([a, b]) => `${line(a)}: ${line(b)}`).join(',\n')}\n}`;
    }
    return `${line(k)}: ${line(v)}`;
  });
  return `window.COURSE = {\n${parts.join(',\n')}\n};\n`;
}
