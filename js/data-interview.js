// Spoken interview scripts. Each topic: main question q, and follow-up rules [regex source, follow-up question].
// The interviewer picks a follow-up when your answer contains matching words (a simple script, not an AI).
window.INTERVIEW_GENERIC = [
 "Why do you say that?",
 "Can you give me a real example?",
 "What difficulties might come with that?",
 "How would you explain that to a person who knows nothing about the subject?",
 "What would you do differently if it did not work?"
];
window.INTERVIEWS = {
css:{
 name:"CSS / PMS Interview Board",
 desc:"A civil-service interview board. Formal questions on your background, Pakistan, foreign policy and ethics.",
 opening:"Assalam o Alaikum. Please be seated. Welcome to the interview.",
 closing:"Thank you. The interview is over. You may leave now. Khuda hafiz.",
 topics:[
  {q:"Please introduce yourself. Tell us about your education and your family background.",follow:[
    ["international relations|\\bIR\\b|politic","You studied International Relations. Which theory or thinker influenced you the most, and why?"],
    ["computer|software|technology|\\bBSc\\b","You also have a degree in Computer Science. How can technology improve government services in Pakistan?"],
    ["translat|freelanc|online","You work as a freelance translator. What has that work taught you about the people you serve?"],
    ["quetta|balochistan","You belong to Quetta. What is the biggest problem of Balochistan, and how would you solve it?"],
    ["pashto|pashtun|urdu|language","You speak several languages. How can language policy help national unity?"]]},
  {q:"Why do you want to join the civil service?",follow:[
    ["serve|service|people|nation|country|public","Serving the people is a common answer. How would you serve them if you were posted to a remote district with few resources?"],
    ["power|authority|status|respect|prestige","Is authority your motive? How will you use power without abusing it?"],
    ["salary|money|job|secur|stable","Many candidates join for job security. What will make you different from them?"],
    ["change|reform|improve|difference","You want to bring change. Please name one reform you would start in your first year."]]},
  {q:"In your opinion, what is the biggest challenge facing Pakistan today?",follow:[
    ["econom|inflation|debt|imf|poverty","How would you fix the economy in the short term, and what must change in the long term?"],
    ["terror|security|extrem|militan","What role should civilian institutions play in countering extremism?"],
    ["educat|literacy|school","Education is a provincial subject after the 18th Amendment. Why have results still not improved?"],
    ["water|climate|flood|environment","How are climate change and the water crisis connected in Pakistan?"],
    ["corrupt|govern|institution|justice","Where does corruption begin, and what should an honest officer do when he sees it?"],
    ["politic|democra|stabil","How can political stability be achieved without weakening democracy?"]]},
  {q:"Briefly describe Pakistan's foreign policy. Who are its main partners and who are its main challenges?",follow:[
    ["china|cpec","Can Pakistan keep a balance between China and the United States?"],
    ["india|kashmir","Is dialogue with India possible? On what terms?"],
    ["afghan|taliban|border|refugee","How should Pakistan deal with Afghanistan, especially on border management and refugees?"],
    ["america|united states|\\bus\\b|usa|west","How can Pakistan rebuild trust with Western countries without losing its independence?"],
    ["saudi|iran|gulf|middle east|muslim","What should Pakistan's role be in the Muslim world?"]]},
  {q:"Suppose a powerful local leader asks you, as a young officer, to bend a rule for him. What will you do?",follow:[
    ["refuse|\\bno\\b|law|rule|merit|honest|cannot","He is very influential and threatens to have you transferred. Does that change your decision?"],
    ["help|accept|agree|adjust|manage|request","Would that not be unfair to other citizens? Please reconsider your answer."],
    ["senior|report|inform|superior|document","What if your own senior officer is the one who tells you to oblige him?"]]},
  {q:"What can the state do to increase the participation of women in the workforce?",follow:[
    ["educat|school|literacy","Many girls drop out after primary school. What practical steps would you take at district level?"],
    ["law|legal|harass|protect|safe|transport","Laws already exist. Why are they not implemented, and what would you change?"],
    ["culture|tradition|family|society|mindset","How can attitudes change without causing a backlash from the community?"]]},
  {q:"Where do you see yourself in ten years, and what is your plan if you are not selected this time?",follow:[
    ["study|scholarship|abroad|master|phd","Why not serve in Pakistan? Would you come back after studying abroad?"],
    ["business|freelanc|translat|own","How would your private experience help you if you join the government?"]]}
 ]},
freelance:{
 name:"Freelance Client Conversation",
 desc:"A client talks to you about a translation job. Practise polite, clear professional English.",
 opening:"Hello! Thank you for taking my call. I have a project in mind.",
 closing:"Thank you. That was very helpful. I will think about it and send you the order. Goodbye.",
 topics:[
  {q:"I have a legal document in Pashto that must be translated into English. Can you tell me about your experience?",follow:[
    ["year|project|100|many|hundred","That sounds good. Can you describe one difficult project and how you handled it?"],
    ["legal|tazkira|certificate|document|official","How do you make sure that names and dates are exactly correct in an official document?"],
    ["native|pashto|quetta","Pashto has several dialects. How do you decide which words to use?"]]},
  {q:"What is your price, and how long will it take for a ten-page document?",follow:[
    ["hour|day|24|48|deliver","What if I need it urgently, within six hours? Can you do it?"],
    ["\\$|dollar|rupee|price|rate|page|fixed","That seems a little high. Can you give me a discount for a long-term project?"]]},
  {q:"My document contains private information. Is it safe with you?",follow:[
    ["confiden|privat|secure|delete|not share|safe","Will you sign a non-disclosure agreement if I ask?"],
    ["yes|sure|promise|guarantee","What exactly do you do with the file after the work is finished?"]]},
  {q:"I received your translation, but I think there is a mistake. I am not happy.",follow:[
    ["sorry|apolog","Apologies are fine, but what exactly will you do to fix it, and by when?"],
    ["correct|fix|revise|edit|free|check","How can I be sure that the correction will be accurate this time?"],
    ["show|which|where|point|send","Here is the line I do not like. Will you explain why you chose that word?"]]},
  {q:"Why should I choose you and not another translator on the platform?",follow:[
    ["native|quality|accura|experience|fast|reliable","Other translators say the same. Can you show me proof, for example reviews or samples?"],
    ["price|cheap|discount|low","I do not want only a cheap price. What about quality?"]]},
  {q:"Can you also do graphic design or audio transcription for my company?",follow:[
    ["design|photoshop|illustrator|logo","Tell me about a design project that you are proud of."],
    ["transcri|audio|video","How do you handle poor-quality audio with background noise?"]]}
 ]},
job:{
 name:"General Job Interview",
 desc:"Common questions for remote jobs, data entry and office work.",
 opening:"Good morning. Thank you for coming. Let us begin the interview.",
 closing:"Thank you for your time. We will contact you soon. Have a good day.",
 topics:[
  {q:"Tell me about yourself and why you applied for this job.",follow:[
    ["experience|worked|year|project","What is the achievement you are proudest of in that work?"],
    ["learn|grow|skill|career","What skill do you want to learn here in the first six months?"]]},
  {q:"What are your greatest strengths?",follow:[
    ["accura|careful|detail|quality","Can you give an example when your attention to detail saved a project?"],
    ["fast|speed|deadline|time","Tell me about a time you delivered work before a tight deadline."],
    ["communicat|team|people|polite","How do you communicate when you disagree with someone?"]]},
  {q:"What is your biggest weakness?",follow:[
    ["english|speak|fluen|confiden","What are you doing to improve it?"],
    ["perfect|slow|careful|too much","Is that really a weakness? How do you manage it?"]]},
  {q:"Tell me about a time when you worked under pressure.",follow:[
    ["deadline|urgent|late|client","What did you learn from that experience?"],
    ["team|colleague|manager|help","How did you divide the work, and what was your role?"]]},
  {q:"How do you handle a disagreement with a colleague or a client?",follow:[
    ["listen|calm|polite|understand","What if the other person remains angry?"],
    ["manager|senior|report|escalate","When is it right to involve your manager?"]]},
  {q:"Where do you see yourself in five years, and do you have any questions for us?",follow:[
    ["manager|lead|senior|grow|promotion","What will you do to earn that position?"],
    ["study|degree|master|learn","How will your studies fit with full-time work?"]]}
 ]}
};
