const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#main-nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const stories = {
  zero: {
    tag: 'Episode zero · Survival diary',
    title: 'The lights that stay on',
    intro: 'After the rain, London always looks as though it knows something it has no intention of telling you.',
    body: [
      `The pavements reflect windows, streetlamps and people walking quickly, pretending to have somewhere definite to be. It is almost eleven. Across the road, a man is waiting outside a blue door.`,
      `He checks his phone. Puts it back in his pocket. A few seconds later, he checks it again.`,
      `Perhaps someone has written to say they are on their way.`,
      `Perhaps no one has written at all.`,
      `At a certain age, you learn that both possibilities can produce exactly the same expression.`,
      `I watch him from my window, holding a cup of tea that has long since gone cold. It is not curiosity. Or not only curiosity. I am interested in people when they believe no one is watching. That is when they finally stop performing.`,
      `My phone lights up on the table.`,
      `Are you still awake?`,
      `The message is from a man I have not heard from in almost three months. One of those men who disappear without an argument, without saying goodbye and, most inconveniently, without dying. You cannot even romanticise them properly.`,
      `I read the question again.`,
      `He does not ask how I am. He does not say he has missed me. He only wants to know whether I am still awake.`,
      `I am.`,
      `But I do not reply.`,
      `Being available and allowing yourself to be found available are not quite the same thing. It is a distinction I learned late in life, along with the importance of a decent face cream and the complete futility of arguing with a man whose emotional vocabulary consists mainly of emojis.`,
      `I look outside again.`,
      `The man beside the blue door has lit a cigarette. He shields it from the rain with one hand. He is over fifty, perhaps only just. His coat is too light for the weather, and he still carries that particular posture of someone who hopes to be desired without appearing to be waiting.`,
      `I know that posture.`,
      `We have all worn it.`,
      `We wear it when we check whether someone has read our message. When we say a relationship “was never anything serious,” even though we spent weeks imagining where his toothbrush might go. When we persuade ourselves that solitude is a choice because the alternative would be admitting that, on certain evenings, it is not.`,
      `My phone lights up again.`,
      `I was thinking about you.`,
      `There it is.`,
      `The sentence that opens every door we had closed with great dignity and very poor carpentry.`,
      `I could answer.`,
      `I could pretend to be detached. I could write something brief, elegant and faintly cruel. I have enough experience to know which words to use and enough vanity to want them to have an effect.`,
      `Instead, I place the phone face down on the table.`,
      `Not because I have suddenly become wise.`,
      `I am still romantic, against all available evidence.`,
      `But tonight I would rather watch the man across the road.`,
      `The blue door finally opens. Another man appears. They do not embrace immediately. For a moment, they remain perfectly still, separated by a few inches and everything they have not yet said.`,
      `Then one of them smiles.`,
      `It is a small, cautious smile.`,
      `The other lowers his eyes.`,
      `The door closes behind them.`,
      `I remain at the window for another few minutes. The street is empty again, but a light comes on upstairs.`,
      `Perhaps they will fall in love.`,
      `Perhaps they will spend only the night together.`,
      `Perhaps tomorrow one of them will say he is not ready for anything serious, as though love were a flat still under construction.`,
      `I cannot know.`,
      `And that is precisely what interests me.`,
      `What happens between desire and fear. Between a message written and one deleted. Between a body growing older and the stubborn, almost comic need to be chosen again.`,
      `I write about people waiting outside doors.`,
      `And those who remain behind windows.`,
      `About men who disappear and later ask whether we are still awake.`,
      `I write about loneliness, but not as an illness. About desire, without pretending it is always romantic. About age, sex, missed opportunities and the ones we were probably fortunate to miss.`,
      `I write about what we show.`,
      `And, above all, what we try to hide.`,
      `The phone does not light up again.`,
      `For a moment, I feel something that might be sadness.`,
      `Or relief.`,
      `At a certain age, you learn that these, too, can produce exactly the same expression.`,
      `Outside, it begins to rain again.`,
      `Upstairs in the house with the blue door, the light remains on.`,
    ],
  },
  stanze: {
    tag: 'Section 01 · First person',
    title: 'Andrea’s Stories',
    intro: 'Here, the distance between the writer and what is being told disappears.',
    body: [
      `Andrea’s Stories gathers pages drawn from my own experience: memory, relationships, solitude, desire, the body, age and change.`,
      `It is not an orderly diary and it offers no easy answers. It is where I try to name things while they are still happening, even when the name is uncomfortable.`,
      `The voice is first person and the material is personal. The writing, however, is always looking for the point at which an individual experience becomes recognisable to someone else.`,
    ],
  },
  osservate: {
    tag: 'Section 02 · Ideas and reflections',
    title: 'Unfiltered Thoughts',
    intro: 'The questions that remain when we stop softening the answers.',
    body: [
      `Here I observe London and the present: the last bus, people standing before a screen, the new languages of desire, and the ways technology, money and solitude reshape our days.`,
      `These are notes, short essays and fragments of travel. They are not necessarily about me, but they carry my point of view: curious, involved and occasionally ironic.`,
      `There are no tourist postcards here. I am interested in the real city, the contradictions of now and the small gestures that unknowingly document an era.`,
    ],
  },
  passaggio: {
    tag: 'Section 03 · Third person',
    title: 'Other People’s Stories',
    intro: 'People entrust us with stories that continue to live after we have said goodbye.',
    body: [
      `This section belongs to lives other than my own: encounters, confidences, stories heard and characters inspired by reality, all observed from outside.`,
      `When a story begins with real events, names, places and identifying details are transformed. The loyalty is not to the record, but to the emotional truth of the person and the moment.`,
      `Andrea Morel remains outside the frame. He watches, listens and reconstructs what may have happened between the sentence that was spoken and the one left unsaid.`,
    ],
  },
  distanza: {
    tag: 'Story · I',
    title: 'The distance between two silences',
    intro: 'Some places do not ask to be remembered.',
    body: [
      `They remain there, at the edge of memory, like a light left on in an empty room. You recognise them only once you are far away: in the low sound of the sea, in the scent of rain on stone, in the precise way the wind makes you lower your gaze.`,
      `I walked without a clear destination. The coast stretched ahead of me, grey and stubborn, while behind me the path slowly disappeared. I thought that people do the same: they enter our lives with certain steps and then, gradually, become landscape.`,
      `Between one silence and the next there is always a distance to cross. Sometimes a single word is enough. Other times, it takes an entire journey.`,
    ],
  },
  treni: {
    tag: 'Travel notebook · I',
    title: 'The trains that leave at night',
    intro: 'At night, every departure feels more final.',
    body: [
      `The window returned my reflection alongside the station lights. For a few moments, I could not tell which of the two worlds was real: the nearly empty carriage, or the liquid city beyond the glass.`,
      `On the seat opposite, a forgotten book had been left open halfway through. No name, no ticket. Only a folded corner on page forty-seven, like a small promise to return.`,
      `Night trains do not carry people alone. They carry possible versions of ourselves, lives we might have lived had we stepped off one stop earlier.`,
    ],
  },
  domeniche: {
    tag: 'Small things · II',
    title: 'The secret art of Sundays',
    intro: 'A Sunday well spent leaves no evidence.',
    body: [
      `It begins late, with the sound of coffee rising and light moving across the floor. It demands no schedule. It does not measure time in results.`,
      `It is a day that reminds us how to be, before we begin to do. A book left open, a walk without a destination, lunch stretching until it becomes indistinguishable from evening.`,
      `Perhaps slowness is not a form of surrender. Perhaps it is the most elegant way we have found to resist the disappearance of things.`,
    ],
  },
  lettere: {
    tag: 'Archive · III',
    title: 'Letters never sent',
    intro: 'We write certain letters precisely so they will never arrive.',
    body: [
      `We keep them in a drawer, among papers that no longer matter and photographs of people without names. The paper yellows. The ink, meanwhile, seems to wait.`,
      `An unsent letter is not a failed conversation. It is a private room where we can tell the truth without asking it to have consequences.`,
      `Every now and then, I read them again. Not to find the courage to send them, but to meet the person I was when I still believed I might.`,
    ],
  },
};

const dialog = document.querySelector('#reader');
const content = dialog.querySelector('.reader-content');

document.querySelectorAll('[data-article]').forEach((button) => button.addEventListener('click', () => {
  const story = stories[button.dataset.article];
  content.innerHTML = `<p class="kicker">${story.tag}</p><h2>${story.title}</h2><p class="intro">${story.intro}</p>${story.body.map((paragraph) => `<p>${paragraph}</p>`).join('')}`;
  dialog.showModal();
  content.scrollTop = 0;
}));

dialog.querySelector('.reader-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('#newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  event.target.reset();
  document.querySelector('.form-note').textContent = 'Thank you. The next letter will arrive here.';
});
