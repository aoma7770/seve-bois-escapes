#import "report-theme.typ": report-accent, report-theme

#show: report-theme.with(
  title: "The Laforet Escape Guide",
  author: "Green Cottages of Laforet",
  rhythm: "report",
  running-header: true,
)

// ---------- Title page ----------
#page(margin: 0pt, numbering: none, header: none)[
  #image("assets/hero.webp", width: 100%, height: 14cm, fit: "cover")
  #pad(left: 2.2cm, right: 2.2cm, top: 1.5cm, bottom: 1.5cm)[
    #text(size: 11pt, weight: "bold", fill: report-accent)[GREEN COTTAGES OF LAFORET]
    #v(0.55em)
    #text(size: 28pt, weight: "bold")[The Laforet Escape Guide]
    #v(0.45em)
    #text(size: 15pt, fill: luma(80))[A slow-travel companion to the Semois valley and Belgian Ardennes]
    #v(1.2em)
    #line(length: 28%, stroke: 1pt + report-accent)
    #v(1.2em)
    #text(size: 10pt, fill: luma(90))[Forest paths, village heritage, river days, and the simple art of staying awhile.]
  ]
]

#page(numbering: none, header: none)[
  #outline(title: [Inside this guide], indent: 1.5em)
  #v(2em)
  #block(fill: rgb("eef3ed"), inset: 1.2em, radius: 6pt)[
    *A note before you go.*

    This guide is designed for planning inspiration. Nearby businesses, trails, water conditions, events, transport and opening hours can change, so please verify current details independently before setting out.
  ]
]

#counter(page).update(1)

= Welcome to Laforet

There are places that invite you to do more, and places that invite you to notice more. Laforet belongs to the second kind. Set in the Belgian Ardennes, within the municipality of Vresse-sur-Semois, the village looks out over a landscape of wooded hills, slate-roofed stone homes and the winding Semois river below.

Laforet is officially recognised among the *Most Beautiful Villages of Wallonia*. Its appeal is not built around a single attraction. It is the combination of scale, texture and quiet: a historic church, traditional tobacco-drying sheds, small fountains and washhouses, and paths that open into long views across the valley.

At Green Cottages of Laforet, the idea is simple: use a comfortable base, then let the landscape set the pace. Begin with a morning walk, pause for a long lunch, return for an unhurried afternoon, and leave room for the unexpected.

#figure(
  image("assets/forest.webp", width: 100%),
  caption: [The wooded character of the Belgian Ardennes around Laforet.],
)

= A three-day rhythm

== Day one: arrive gently

Give yourself permission not to rush. Settle in, take a short orientation walk through the village and notice the details that are easy to miss from a car: stonework, timber, old farm structures and the changing light across the hills. A simple first evening works well here—local food, a warm drink and an early night after the journey.

== Day two: follow the valley

Make the Semois the centre of the day. The river is below the cottages rather than directly beside them, with a scenic walk of approximately ten minutes involving a descent through the village. If you are planning a riverside walk, kayaking or cycling, check current conditions and local operator availability before leaving.

Return by a different route if conditions allow, or make time for a viewpoint. The most rewarding Ardennes days often alternate movement and stillness rather than filling every hour.

== Day three: choose a nearby story

Spend the final day on heritage, food or a longer outing. You might explore a historic village, visit a regional museum or castle, seek out a local meal, or simply repeat the walk that became your favourite. The best itinerary is the one that leaves you feeling restored rather than scheduled.

= Five ways to experience the area

#grid(
  columns: (1fr, 1fr),
  gutter: 1.2em,
  [*01 · Village details*\Look for slate, timber, fountains, washhouses and the village's traditional tobacco-drying heritage.],
  [*02 · Forest walking*\Use marked local paths and viewpoints, checking trail conditions and signage on the day.],
  [*03 · River time*\Enjoy the Semois valley on foot or through a local activity provider; the river is not direct cottage access.],
  [*04 · Ardennes table*\Make space for regional produce, cheeses, seasonal dishes and locally made drinks.],
  [*05 · Dark skies*\When the forecast is clear, step outside after sunset and let your eyes adjust to the valley night.],
)

= Practical planning

== Getting there

Laforet is approximately two hours by car from Brussels, around three and a half hours from Paris and about one and a half hours from Luxembourg, depending on route and traffic. Bertrix is the nearest rail connection referenced for the area; onward travel may require a taxi or rental car. Confirm journey times and transport connections before departure.

== What to bring

Pack shoes with good grip for village slopes and forest paths, layers for changeable Ardennes weather, a refillable water bottle and a small day bag. A torch is useful for evening walks, and binoculars can add a quiet extra dimension to the landscape.

== Plan with flexibility

The river, trails and nearby attractions are part of the wider local area and are not operated or guaranteed by Green Cottages. Check seasonal access, weather, water levels, safety guidance and opening times directly with the relevant local provider or authority.

#figure(
  image("assets/river.webp", width: 100%),
  caption: [The Semois valley is close enough for a walk, while the cottages remain above the river.],
)

= A more considered stay

A stay in Laforet works best when the accommodation is treated as a pause, not simply a place to sleep. Leave a little space in the day for a slow breakfast, a book by the window, a conversation that runs long or the decision to take the scenic route home.

Whether you are travelling as a couple, a family or a group of friends, the two-cottage setting offers a useful balance: shared time when you want it, and the possibility of retreat when you need it. The surrounding landscape does the rest.

#block(fill: rgb("f4efe6"), inset: 1.4em, radius: 6pt)[
  *Your next step*

  Explore the cottages, check current availability and plan your stay at *sevebois.manus.space*. Booking information, practical arrival details and private guest instructions are provided through the appropriate booking communication rather than in this public guide.
]

= A final invitation

Come for the forest, the river valley or the village heritage. Stay for the feeling of having made room for something quieter. Laforet is a place to walk slowly, look closely and let the Ardennes become part of the memory of the trip.

#align(center)[
  #v(1em)
  #text(size: 12pt, weight: "bold", fill: report-accent)[Green Cottages of Laforet]
  #v(0.35em)
  #text(size: 9pt, fill: luma(90))[A quiet base for exploring the Semois valley]
]

#pagebreak()

= Guide notes & responsible planning

This free guide is intended as a helpful introduction to Laforet and the wider Semois valley. It does not replace official information, professional safety advice, or current instructions from local operators and authorities.

Please confirm current conditions before activities, respect private land and marked routes, and leave the landscape as you found it. Nearby experiences are independent third-party services; Green Cottages does not operate or guarantee their availability.

For your privacy and security, this public guide intentionally excludes access codes, WiFi credentials, exact arrival directions and other private guest information. Those details belong only in the private post-booking communication.
