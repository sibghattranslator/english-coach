// Subject-tagged translation pairs: [urdu, english (alternatives separated by |), tag]
window.PAIR_TAGS = {gen:"General",ir:"International Relations",gender:"Gender Studies",eh:"European History",crim:"Criminology",pak:"Pakistan Affairs",isl:"Islamiat",sci:"General Science",ess:"English Essay / Precis",ca:"Current Affairs"};
(function(){
const T=(tag,list)=>list.forEach(p=>window.PAIRS.push([p[0],p[1],tag]));
window.PAIRS.forEach(p=>{if(!p[2])p[2]="gen"});
T("ir",[
["بین الاقوامی تعلقات ریاستوں کے باہمی تعلقات کا مطالعہ ہے۔","International relations is the study of relations among states.|International relations is the study of the relationships between states."],
["حقیقت پسندی کے مطابق ریاستیں طاقت اور اپنی بقا کے لیے کوشش کرتی ہیں۔","According to realism, states strive for power and their own survival."],
["اقوام متحدہ کا مقصد عالمی امن کو برقرار رکھنا ہے۔","The purpose of the United Nations is to maintain world peace.|The aim of the United Nations is to maintain international peace."],
["سرد جنگ امریکہ اور سوویت یونین کے درمیان نظریاتی مقابلہ تھی۔","The Cold War was an ideological rivalry between America and the Soviet Union."],
["طاقت کا توازن جنگ کو روکنے میں مدد دیتا ہے۔","The balance of power helps to prevent war."],
["لبرل ازم کے مطابق تعاون اور بین الاقوامی ادارے امن لاتے ہیں۔","According to liberalism, cooperation and international institutions bring peace."],
["ہر ریاست اپنی خودمختاری کی حفاظت کرتی ہے۔","Every state protects its sovereignty."],
["عالمگیریت نے دنیا کی معیشتوں کو ایک دوسرے سے جوڑ دیا ہے۔","Globalization has connected the economies of the world with each other."],
["سفارت کاری تنازعات کو پرامن طریقے سے حل کرنے کا ذریعہ ہے۔","Diplomacy is a means of resolving disputes peacefully."],
["پابندیاں ایک ملک پر دباؤ ڈالنے کا طریقہ ہیں۔","Sanctions are a way of putting pressure on a country."],
["کئی ممالک کے پاس ایٹمی ہتھیار ہیں اور یہ ایک بڑا خطرہ ہے۔","Many countries have nuclear weapons, and this is a great danger.|Several countries possess nuclear weapons, and this is a major threat."],
["علاقائی تنظیمیں ممالک کے درمیان تعاون کو فروغ دیتی ہیں۔","Regional organizations promote cooperation among countries."]]);
T("gender",[
["صنف اور جنس میں فرق ہے۔","There is a difference between gender and sex."],
["صنف ایک سماجی تشکیل ہے۔","Gender is a social construct."],
["حقوقِ نسواں کی تحریک عورتوں کے برابر حقوق کا مطالبہ کرتی ہے۔","The feminist movement demands equal rights for women."],
["تعلیم عورتوں کو بااختیار بناتی ہے۔","Education empowers women."],
["بہت سی عورتوں کو کام کی جگہ پر ہراسانی کا سامنا ہے۔","Many women face harassment in the workplace."],
["صنفی عدم مساوات ترقی کی راہ میں رکاوٹ ہے۔","Gender inequality is an obstacle to development."],
["عورتوں کو وراثت میں اپنا حصہ ملنا چاہیے۔","Women should receive their share of inheritance."],
["اجرت میں فرق مردوں اور عورتوں کے درمیان ناانصافی کو ظاہر کرتا ہے۔","The wage gap shows the injustice between men and women.|The pay gap shows the injustice between men and women."],
["پاکستان میں گھریلو تشدد کے خلاف قانون موجود ہے۔","There is a law against domestic violence in Pakistan."],
["پدرسری معاشرہ مردوں کو زیادہ اختیار دیتا ہے۔","A patriarchal society gives more power to men."],
["عورتوں کی سیاسی شرکت جمہوریت کو مضبوط کرتی ہے۔","Women's political participation strengthens democracy."],
["پائیدار ترقی کے لیے صنفی مساوات ضروری ہے۔","Gender equality is necessary for sustainable development."]]);
T("eh",[
["انقلابِ فرانس سن سترہ سو نواسی میں شروع ہوا۔","The French Revolution began in 1789."],
["نپولین نے یورپ کے بڑے حصے کو فتح کر لیا تھا۔","Napoleon had conquered a large part of Europe."],
["صنعتی انقلاب برطانیہ سے شروع ہوا۔","The Industrial Revolution started in Britain."],
["پہلی جنگِ عظیم سن انیس سو چودہ میں شروع ہوئی۔","The First World War began in 1914."],
["معاہدۂ ورسائی نے جرمنی پر سخت شرائط عائد کیں۔","The Treaty of Versailles imposed harsh conditions on Germany."],
["نشاۃِ ثانیہ نے یورپ میں علم اور فن کو فروغ دیا۔","The Renaissance promoted knowledge and art in Europe."],
["ویانا کانگریس کا مقصد یورپ میں امن اور توازن قائم کرنا تھا۔","The aim of the Congress of Vienna was to establish peace and balance in Europe."],
["اٹلی اور جرمنی کا اتحاد انیسویں صدی میں ہوا۔","The unification of Italy and Germany took place in the nineteenth century."],
["دوسری جنگِ عظیم میں کروڑوں لوگ مارے گئے۔","Millions of people were killed in the Second World War."],
["اصلاحِ کلیسا نے عیسائیت کو تقسیم کر دیا۔","The Reformation divided Christianity."],
["روسی انقلاب سن انیس سو سترہ میں آیا۔","The Russian Revolution took place in 1917.|The Russian Revolution came in 1917."],
["یورپی یونین کی بنیاد معاشی تعاون پر رکھی گئی تھی۔","The European Union was founded on economic cooperation."]]);
T("crim",[
["جرم قانون کی خلاف ورزی ہے جس کی سزا ملتی ہے۔","A crime is a violation of the law which is punished.|A crime is a breach of law for which there is punishment."],
["غربت اور بے روزگاری جرائم کی بڑی وجوہات ہیں۔","Poverty and unemployment are major causes of crime."],
["سزا کا مقصد جرم کو روکنا اور مجرم کی اصلاح کرنا ہے۔","The purpose of punishment is to deter crime and reform the offender."],
["پولیس کا کام شہریوں کی جان اور مال کی حفاظت کرنا ہے۔","The job of the police is to protect the life and property of citizens."],
["ہر ملزم اس وقت تک بے گناہ ہے جب تک جرم ثابت نہ ہو۔","Every accused person is innocent until proven guilty."],
["نوجوانوں کے جرائم کی ایک وجہ بری صحبت ہے۔","Bad company is one cause of juvenile crime.|One cause of juvenile delinquency is bad company."],
["جیلوں میں قیدیوں کی تعداد گنجائش سے زیادہ ہے۔","The number of prisoners in jails is more than the capacity.|Prisons are overcrowded."],
["سائبر کرائم تیزی سے بڑھ رہا ہے۔","Cybercrime is increasing rapidly."],
["انصاف میں تاخیر انصاف سے انکار ہے۔","Justice delayed is justice denied."],
["جرائم کی روک تھام کے لیے تعلیم اور روزگار ضروری ہیں۔","Education and employment are necessary for the prevention of crime."],
["کرپشن معاشرے کو اندر سے کھوکھلا کر دیتی ہے۔","Corruption hollows out society from within."],
["گواہوں کو تحفظ دینا عدالتی نظام کے لیے ضروری ہے۔","Protecting witnesses is necessary for the judicial system."]]);
T("pak",[
["پاکستان چودہ اگست انیس سو سینتالیس کو آزاد ہوا۔","Pakistan became independent on the fourteenth of August 1947."],
["قراردادِ لاہور سن انیس سو چالیس میں منظور ہوئی۔","The Lahore Resolution was passed in 1940."],
["قائداعظم محمد علی جناح پاکستان کے بانی ہیں۔","Quaid-e-Azam Muhammad Ali Jinnah is the founder of Pakistan."],
["آئین پاکستان انیس سو تہتر میں نافذ ہوا۔","The Constitution of Pakistan was enforced in 1973."],
["اٹھارویں ترمیم نے صوبوں کو زیادہ اختیارات دیے۔","The Eighteenth Amendment gave more powers to the provinces."],
["پاکستان کی معیشت کا بڑا حصہ زراعت پر منحصر ہے۔","A large part of Pakistan's economy depends on agriculture."],
["بلوچستان رقبے کے لحاظ سے سب سے بڑا صوبہ ہے۔","Balochistan is the largest province in terms of area."],
["پانی کی کمی پاکستان کے لیے ایک سنگین مسئلہ ہے۔","Water shortage is a serious problem for Pakistan."],
["چین پاکستان اقتصادی راہداری ترقی کا ایک بڑا منصوبہ ہے۔","The China-Pakistan Economic Corridor is a major development project."],
["پاکستان کو دہشت گردی کی وجہ سے بہت نقصان ہوا ہے۔","Pakistan has suffered a great deal because of terrorism."],
["مسئلہ کشمیر پاکستان اور بھارت کے درمیان بنیادی تنازع ہے۔","The Kashmir issue is the main dispute between Pakistan and India."],
["سن انیس سو اکہتر میں مشرقی پاکستان بنگلہ دیش بن گیا۔","In 1971, East Pakistan became Bangladesh."]]);
T("isl",[
["اسلام امن، انصاف اور بھائی چارے کا درس دیتا ہے۔","Islam teaches peace, justice and brotherhood."],
["قرآن مجید اللہ کی آخری کتاب ہے۔","The Holy Quran is the last book of Allah."],
["نبی کریم صلی اللہ علیہ وسلم تمام انسانوں کے لیے رحمت ہیں۔","The Holy Prophet, peace be upon him, is a mercy for all mankind."],
["اسلام کے پانچ بنیادی ارکان ہیں۔","Islam has five basic pillars."],
["زکوٰۃ امیروں پر فرض ہے تاکہ غریبوں کی مدد ہو۔","Zakat is obligatory on the rich so that the poor can be helped."],
["خلفائے راشدین نے عدل پر مبنی حکومت قائم کی۔","The Rightly Guided Caliphs established a government based on justice."],
["میثاقِ مدینہ ایک اہم تحریری معاہدہ تھا۔","The Charter of Madinah was an important written agreement."],
["اسلام میں علم حاصل کرنا ہر مسلمان پر فرض ہے۔","In Islam, acquiring knowledge is obligatory on every Muslim."],
["حجۃ الوداع کا خطبہ انسانی حقوق کا عظیم منشور ہے۔","The Farewell Sermon is a great charter of human rights."],
["اسلام نے عورتوں کو وراثت اور تعلیم کا حق دیا۔","Islam gave women the right to inheritance and education."],
["صبر اور شکر مسلمان کی بڑی صفات ہیں۔","Patience and gratitude are great qualities of a Muslim."],
["اجتہاد نئے مسائل کے حل کے لیے ضروری ہے۔","Ijtihad is necessary for solving new problems."]]);
T("sci",[
["پانی ہائیڈروجن اور آکسیجن سے مل کر بنتا ہے۔","Water is made of hydrogen and oxygen.|Water is formed by the combination of hydrogen and oxygen."],
["زمین سورج کے گرد گھومتی ہے۔","The Earth revolves around the Sun.|The Earth moves around the Sun."],
["پودے روشنی کی مدد سے اپنی خوراک خود بناتے ہیں۔","Plants make their own food with the help of light."],
["عالمی حرارت میں اضافہ ماحول کے لیے خطرہ ہے۔","Global warming is a threat to the environment."],
["روشنی کی رفتار آواز کی رفتار سے بہت زیادہ ہے۔","The speed of light is much greater than the speed of sound."],
["انسانی جسم میں دل خون کو پمپ کرتا ہے۔","In the human body, the heart pumps blood."],
["ویکسین ہمیں بیماریوں سے بچاتی ہے۔","Vaccines protect us from diseases."],
["مصنوعی ذہانت ہماری زندگی کو بدل رہی ہے۔","Artificial intelligence is changing our lives."],
["شمسی توانائی ایک صاف اور قابلِ تجدید ذریعہ ہے۔","Solar energy is a clean and renewable source."],
["درخت لگانا ماحولیاتی آلودگی کم کرتا ہے۔","Planting trees reduces environmental pollution."],
["ہر عمل کا برابر اور مخالف ردِعمل ہوتا ہے۔","Every action has an equal and opposite reaction."],
["انٹرنیٹ نے معلومات تک رسائی آسان بنا دی ہے۔","The internet has made access to information easy."]]);
T("ess",[
["محنت کامیابی کی کنجی ہے۔","Hard work is the key to success."],
["تعلیم کسی بھی قوم کی ترقی کی بنیاد ہے۔","Education is the foundation of the progress of any nation."],
["وقت کی قدر کرنے والے لوگ کامیاب ہوتے ہیں۔","People who value time become successful.|Those who value time succeed."],
["اس مضمون میں ہم مسئلے کی وجوہات اور حل پر بات کریں گے۔","In this essay, we will discuss the causes of the problem and its solutions."],
["خلاصہ یہ ہے کہ اتحاد میں طاقت ہے۔","In conclusion, there is strength in unity.|To sum up, unity is strength."],
["بہت سے لوگوں کا خیال ہے کہ ٹیکنالوجی نے زندگی آسان کر دی ہے۔","Many people think that technology has made life easy."],
["دوسری طرف، اس کے کچھ نقصانات بھی ہیں۔","On the other hand, it also has some disadvantages."],
["حکومت کو اس مسئلے پر فوری توجہ دینی چاہیے۔","The government should pay immediate attention to this problem."],
["مثال کے طور پر، ترقی یافتہ ممالک تعلیم پر زیادہ خرچ کرتے ہیں۔","For example, developed countries spend more on education."],
["اگر ہم آج کوشش نہ کریں تو کل بہت دیر ہو جائے گی۔","If we do not try today, it will be too late tomorrow."],
["اس کے برعکس، غریب ممالک کو کئی مشکلات کا سامنا ہے۔","In contrast, poor countries face many difficulties."],
["میرے نزدیک اس مسئلے کا بہترین حل تعلیم ہے۔","In my opinion, the best solution to this problem is education."]]);
T("ca",[
["مہنگائی نے عام آدمی کی زندگی مشکل بنا دی ہے۔","Inflation has made the life of the common man difficult."],
["حکومت نے نئے بجٹ کا اعلان کیا ہے۔","The government has announced the new budget."],
["سیلاب سے لاکھوں لوگ متاثر ہوئے۔","Millions of people were affected by the floods."],
["وزیراعظم نے غیر ملکی دورے کا آغاز کیا۔","The Prime Minister began a foreign visit."],
["آئی ایم ایف نے قرض کی نئی قسط کی منظوری دی۔","The IMF approved a new instalment of the loan."],
["اقوام متحدہ کے اجلاس میں ماحولیاتی تبدیلی پر بات ہوئی۔","Climate change was discussed at the United Nations meeting."],
["پاکستان اور افغانستان کے درمیان سرحدی مسائل موجود ہیں۔","There are border issues between Pakistan and Afghanistan."],
["عدالتِ عظمیٰ نے اس مقدمے کا فیصلہ سنا دیا۔","The Supreme Court has announced its decision in this case."],
["روپے کی قدر میں کمی نے معیشت کو متاثر کیا۔","The fall in the value of the rupee has affected the economy."],
["انتخابات کے نتائج کا اعلان کر دیا گیا ہے۔","The results of the elections have been announced."],
["برآمدات میں اضافہ معیشت کے لیے اچھی خبر ہے۔","An increase in exports is good news for the economy."],
["مشرقِ وسطیٰ میں کشیدگی عالمی امن کے لیے خطرہ ہے۔","Tension in the Middle East is a threat to world peace."]]);
})();
