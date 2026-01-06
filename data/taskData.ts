export interface Task {
  id: string;
  text: string;
}

export const recentTasks: Task[] = [
  { id: 'rt1', text: 'Completed soil testing for Field A.' },
  { id: 'rt2', text: 'Applied NPK fertilizer to wheat crop.' },
  { id: 'rt3', text: 'Repaired irrigation pump.' },
];

export const upcomingTasks: Task[] = [
  { id: 'ut1', text: 'Spray fungicide on tomato plants.' },
  { id: 'ut2', text: 'Schedule vaccination for Lakshmi (Cow A101).' },
  { id: 'ut3', text: 'Scout for aphids in the cotton field.' },
  { id: 'ut4', text: 'Check moisture levels for rice paddy.' },
];
