/* Derive every count and connection from the six work paths. No stored scores. */
window.buildSkillIndex = function(data) {
  const paths = new Set(data.categories.map(c=>c.id));
  const domains = new Set((data.skillCategories||[]).map(c=>c.id));
  const catalog = new Map((data.skills||[]).filter(s=>domains.has(s.category)).map(s=>[s.id,s]));
  const evidence = new Map();
  for(const entry of data.entries) {
    if(!paths.has(entry.category)) continue;
    for(const id of new Set(entry.skillIds||[])) {
      if(!catalog.has(id)) continue;
      if(!evidence.has(id)) evidence.set(id,new Map());
      evidence.get(id).set(entry.id,entry);
    }
  }
  const skills=[...catalog.values()].filter(s=>evidence.has(s.id)).map(s=>({...s,entries:[...evidence.get(s.id).values()]}));
  const tools=(data.tools||[]).map(tool=>{
    const used=[...new Map(data.entries.filter(e=>paths.has(e.category)&&(e.toolIds||[]).includes(tool.id)).map(e=>[e.id,e])).values()];
    const linkedSkills=skills.filter(s=>(tool.skillIds||[]).includes(s.id)&&used.some(e=>(e.skillIds||[]).includes(s.id)));
    return {...tool,entries:used,skills:linkedSkills};
  }).filter(tool=>tool.entries.length);
  return {skills,tools,domains:(data.skillCategories||[]).map(d=>{
    const members=skills.filter(s=>s.category===d.id);
    const linked=[...new Map(members.flatMap(s=>s.entries).map(e=>[e.id,e])).values()];
    return {...d,skills:members,entries:linked};
  })};

};
