// Single source of truth for the picker.
// Edit freely — every page reads from here.
window.CB_DATA = {
  whatsapp: "94706922157",        // 070 6922 157
  phoneDisplay: "070 6922 157",
  hours: "8 AM – 6 PM · 7 days",
  email: "buildersofceylon@gmail.com",
  instagram: "https://instagram.com/buildersofceylon",
  facebook: "https://facebook.com/buildersofceylon",
  gmb: "https://g.page/buildersofceylon",

  trades: [
    { id: "plumbing",   name: "Plumbing",         tagline: "Taps, pipes, drains, hot water." },
    { id: "electrical", name: "Electrical",       tagline: "Wiring, breakers, lights, switches." },
    { id: "painting",   name: "Painting",         tagline: "Interior, exterior, touch-ups." },
    { id: "masonry",    name: "Masonry",          tagline: "Walls, tiles, plaster, concrete." },
    { id: "equipment",  name: "Equipment Repair", tagline: "Appliances, motors, small machines." },
    { id: "aircon",     name: "Air Conditioning", tagline: "Service, gas, install, repair." },
  ],

  problems: {
    plumbing: [
      "Tap is dripping", "Low water pressure", "Pipe leaking",
      "Toilet not flushing properly", "Hot water not working", "Blocked drain",
      "Install a new tap or shower", "Full bathroom re-fit",
      "Water tank issue", "Something else — I'll explain",
    ],
    electrical: [
      "Power keeps tripping", "A socket isn't working", "Lights flickering",
      "Need new wiring", "Ceiling fan not working", "Install a ceiling light",
      "Switchboard repair / replace", "Inverter or UPS issue",
      "Smell of burning from a socket", "Something else — I'll explain",
    ],
    painting: [
      "Interior wall repaint", "Exterior repaint",
      "Single room touch-up", "Ceiling painting",
      "Wood / door / window painting", "Waterproof coating",
      "Damp patch needs covering", "New construction — first paint",
      "Colour consultation", "Something else — I'll explain",
    ],
    masonry: [
      "Crack in the wall", "Tile coming loose", "Re-tile a floor",
      "Plaster falling off", "Build a small wall", "Concrete repair",
      "Bathroom waterproofing", "Driveway / pavement repair",
      "Boundary wall work", "Something else — I'll explain",
    ],
    equipment: [
      "Washing machine not working", "Fridge not cooling",
      "Microwave issue", "Blender / mixer broken",
      "Water pump not running", "Generator service",
      "Sewing machine repair", "Small motor rewinding",
      "General appliance check-up", "Something else — I'll explain",
    ],
    aircon: [
      "A/C not cooling", "A/C is leaking water", "A/C is making noise",
      "Need a gas refill", "Full service / cleaning",
      "Install a new A/C unit", "Move A/C to another room",
      "Remote not working", "Bad smell from A/C",
      "Something else — I'll explain",
    ],
  },

  districts: ["Colombo", "Gampaha", "Kalutara"],
};
