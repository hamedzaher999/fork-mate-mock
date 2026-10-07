// ForkMate mock backend (single file). Run: node server.js
// Every route is mounted at "/" AND "/api/hamed", so in the app you can set
// baseURL = 'https://YOUR-APP.onrender.com/api/hamed' (or without /api/hamed).
// The app calls everything with GET, but this server answers ANY method.

const express = require("express");
const app = express();
app.use(express.json());

// ---- CORS + logging ----
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Methods", "*");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  console.log(req.method, req.originalUrl);
  next();
});

const router = express.Router();
const r = (path, handler) => router.all(path, handler);

// NOTE: Dart fields typed `double` that are read straight from JSON (no `as num`)
// crash if the JSON number is an integer (e.g. 1200). So those values below
// intentionally have a fractional part (1200.5, 2.5, ...).

// ---------------------------------------------------------------- helpers
const img = (seed) => `https://picsum.photos/seed/${seed}/400/300`;
const iso = (daysAgo = 0) =>
  new Date(Date.now() - daysAgo * 86400000).toISOString();
const LONG_TIME = "5:00:00:00"; // d:h:m:s  (4 parts) or h:m:s (3 parts)

const services = [
  { id: 1, name: "Food" },
  { id: 2, name: "Sweets" },
  { id: 3, name: "Drinks" },
];

const categories = [
  { id: 1, title: "Chicken", service: services[0] },
  { id: 2, title: "Beef", service: services[0] },
  { id: 3, title: "Sides", service: services[0] },
  { id: 4, title: "Desserts", service: services[1] },
  { id: 5, title: "Cold Drinks", service: services[2] },
  { id: 6, title: "Hot Drinks", service: services[2] },
];

const preferences = () => [
  {
    id: 1,
    type: "single-select",
    preference: [
      { name: "Small", price_difference: 0 },
      { name: "Medium", price_difference: 500 },
      { name: "Large", price_difference: 1000 },
    ],
  },
  {
    id: 2,
    type: "multi-select",
    preference: [
      { name: "Extra cheese", price_difference: 700 },
      { name: "Extra sauce", price_difference: 300 },
      { name: "No pickles", price_difference: 0 },
    ],
  },
];

// name, categoryId, price, rate, discount(%) | null, image
const rawItems = [
  [
    1,
    "Chicken Sandwich",
    1,
    15000,
    "4.8",
    20,
    "https://www.themealdb.com/images/media/meals/sbx7n71587673021.jpg",
  ],
  [
    2,
    "Chicken Alfredo",
    1,
    28000,
    "4.5",
    null,
    "https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg",
  ],
  [
    3,
    "Chicken & Chorizo Rice",
    1,
    26000,
    "4.6",
    null,
    "https://www.themealdb.com/images/media/meals/fk80jp1763280767.jpg",
  ],
  [
    4,
    "Chicken Couscous",
    1,
    24000,
    "4.2",
    null,
    "https://www.themealdb.com/images/media/meals/qxytrx1511304021.jpg",
  ],
  [
    5,
    "Chicken Enchilada Casserole",
    1,
    30000,
    "4.4",
    10,
    "https://www.themealdb.com/images/media/meals/qtuwxu1468233098.jpg",
  ],
  [
    6,
    "Halloumi Chicken Burger",
    1,
    22000,
    "4.7",
    null,
    "https://www.themealdb.com/images/media/meals/vdwloy1713225718.jpg",
  ],
  [
    7,
    "Chicken Congee",
    1,
    18000,
    "4.0",
    null,
    "https://www.themealdb.com/images/media/meals/1529446352.jpg",
  ],
  [
    8,
    "Brown Stew Chicken",
    1,
    27000,
    "4.3",
    null,
    "https://www.themealdb.com/images/media/meals/sypxpx1515365095.jpg",
  ],
  [
    9,
    "Aussie Beef Burger",
    2,
    25000,
    "4.9",
    15,
    "https://www.themealdb.com/images/media/meals/44bzep1761848278.jpg",
  ],
  [
    10,
    "Beef & Broccoli Stir-Fry",
    2,
    29000,
    "4.5",
    null,
    "https://www.themealdb.com/images/media/meals/m0p0j81765568742.jpg",
  ],
  [
    11,
    "Beef Bourguignon",
    2,
    38000,
    "4.8",
    null,
    "https://www.themealdb.com/images/media/meals/vtqxtu1511784197.jpg",
  ],
  [
    12,
    "Beef Brisket Pot Roast",
    2,
    42000,
    "4.6",
    null,
    "https://www.themealdb.com/images/media/meals/ursuup1487348423.jpg",
  ],
  [
    13,
    "Beef Banh Mi Bowl",
    2,
    27000,
    "4.1",
    10,
    "https://www.themealdb.com/images/media/meals/z0ageb1583189517.jpg",
  ],
  [
    14,
    "Asado Plate",
    2,
    45000,
    "4.7",
    null,
    "https://www.themealdb.com/images/media/meals/kgfh3q1763075438.jpg",
  ],
  [
    15,
    "Beef Mustard Pie",
    2,
    26000,
    "4.2",
    null,
    "https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg",
  ],
  [
    16,
    "Egg Rolls",
    3,
    12000,
    "4.3",
    null,
    "https://www.themealdb.com/images/media/meals/grhn401765687086.jpg",
  ],
  [
    17,
    "Baba Ghanoush",
    3,
    9000,
    "4.6",
    null,
    "https://www.themealdb.com/images/media/meals/dlmh401760524897.jpg",
  ],
  [
    18,
    "Yuca Fries",
    3,
    8000,
    "4.4",
    null,
    "https://www.themealdb.com/images/media/meals/j223gc1784579841.jpg",
  ],
  [
    19,
    "Cheese Bread",
    3,
    7000,
    "4.5",
    5,
    "https://www.themealdb.com/images/media/meals/ymk7gt1783803106.jpg",
  ],
  [
    20,
    "Algerian Carrots",
    3,
    6000,
    "3.9",
    null,
    "https://www.themealdb.com/images/media/meals/o2cd4r1764113576.jpg",
  ],
  [
    21,
    "Apple Pie",
    4,
    12000,
    "4.8",
    null,
    "https://www.themealdb.com/images/media/meals/stnxzp1784835840.jpg",
  ],
  [
    22,
    "Alfajores",
    4,
    9000,
    "4.7",
    20,
    "https://www.themealdb.com/images/media/meals/a4kgf21763075288.jpg",
  ],
  [
    23,
    "Apple Crumble",
    4,
    11000,
    "4.6",
    null,
    "https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg",
  ],
  [
    24,
    "Apple Cake",
    4,
    10000,
    "4.4",
    null,
    "https://www.themealdb.com/images/media/meals/c0gmo31766594751.jpg",
  ],
  [
    25,
    "Apple Frangipane Tart",
    4,
    13000,
    "4.5",
    null,
    "https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg",
  ],
  [
    26,
    "Apple Berry Smoothie",
    5,
    9000,
    "4.6",
    null,
    "https://www.thecocktaildb.com/images/media/drink/xwqvur1468876473.jpg",
  ],
  [
    27,
    "Banana Milk Shake",
    5,
    10000,
    "4.7",
    10,
    "https://www.thecocktaildb.com/images/media/drink/rtwwsx1472720307.jpg",
  ],
  [
    28,
    "Strawberry Banana Shake",
    5,
    10000,
    "4.5",
    null,
    "https://www.thecocktaildb.com/images/media/drink/vqquwx1472720634.jpg",
  ],
  [
    29,
    "Aloha Fruit Punch",
    5,
    8000,
    "4.2",
    null,
    "https://www.thecocktaildb.com/images/media/drink/wsyvrt1468876267.jpg",
  ],
  [
    30,
    "Cantaloupe Smoothie",
    5,
    9500,
    "4.3",
    null,
    "https://www.thecocktaildb.com/images/media/drink/uqxqsy1468876703.jpg",
  ],
  [
    31,
    "Castilian Hot Chocolate",
    6,
    8000,
    "4.9",
    null,
    "https://www.thecocktaildb.com/images/media/drink/3nbu4a1487603196.jpg",
  ],
];

const makeItem = ([id, name, catId, price, rate, discount, image]) => ({
  id,
  category: categories.find((c) => c.id === catId),
  image,
  name,
  price: price + 0.5, // fractional is fine; `as num` is used here
  rate, // String in the app
  ingredients: ["Fresh ingredients", "House sauce", "Herbs & spices"],
  discount: discount
    ? { type: "percentage", discount: discount + 0.5, lefttime: LONG_TIME }
    : null,
  preference: preferences(),
  my_rate: id % 6, // 0..5
});
const items = rawItems.map(makeItem);

const offers = [
  {
    id: 1,
    name: "Family Offer",
    description: "4 chicken sandwiches + 2 yuca fries + 4 drinks",
    remaining_time: LONG_TIME,
    price: 85000.5,
    allowed_quantity: 3,
  },
  {
    id: 2,
    name: "Student Offer",
    description: "1 sandwich + 1 drink",
    remaining_time: LONG_TIME,
    price: 18000.5,
    allowed_quantity: null,
  },
  {
    id: 4,
    name: "Sweet Combo",
    description: "Any dessert + any hot drink",
    remaining_time: LONG_TIME,
    price: 16000.5,
    allowed_quantity: 10,
  },
  {
    id: 5,
    name: "Burger Night",
    description: "2 burgers + 2 yuca fries + 2 shakes",
    remaining_time: LONG_TIME,
    price: 65000.5,
    allowed_quantity: null,
  },
  {
    id: 3,
    name: "Midnight Deal",
    description: "Any plate + any drink",
    remaining_time: LONG_TIME,
    price: 30000.5,
    allowed_quantity: 5,
  },
];

// ---------------------------------------------------------------- AUTH
const userData = () => ({
  name: "Hamed Test",
  userName: "hamed",
  phoneNumber: "0999999999",
  token: "mock-token-123456",
});

r("/isUsernameAvailable", (req, res) =>
  res.json({ status: "success", message: "username is available" }),
);
r("/deleteAccount", (req, res) =>
  res.json({ status: "success", message: "account deleted" }),
);
r("/signup", (req, res) =>
  res.json({ status: "success", message: "signed up", data: userData() }),
);
r("/login", (req, res) =>
  res.json({ status: "success", message: "logged in", data: userData() }),
);
r("/isNumberAvailable", (req, res) =>
  res.json({ status: "success", message: "code sent" }),
);
r("/changePasswordWithCodeAndNumber", (req, res) =>
  res.json({ status: "success", message: "password changed" }),
);
// app calls  $baseURL/sendCode/number=
router.all(/^\/sendCode(\/.*)?$/, (req, res) =>
  res.json({ status: "success", message: "code sent" }),
);
r("/changePassword", (req, res) =>
  res.json({ status: "success", message: "password changed successfully" }),
);

// ---------------------------------------------------------------- CUSTOMER DATA
r("/archive", (req, res) =>
  res.json({
    2026: {
      October: [
        { orderNumber: 101, created_at: iso(2) },
        { orderNumber: 102, created_at: iso(3) },
      ],
      September: [
        { orderNumber: 90, created_at: iso(30) },
        { orderNumber: 91, created_at: iso(35) },
        { orderNumber: 92, created_at: iso(40) },
      ],
    },
    2025: {
      December: [{ orderNumber: 50, created_at: iso(300) }],
    },
  }),
);

r("/resendCode", (req, res) =>
  res.json({ status: "success", message: "code sent" }),
);
router.all("/confirmationCode/:code", (req, res) =>
  res.json({ status: "success", message: "password changed" }),
);
r("/changeInformation", (req, res) =>
  res.json({
    status: "success",
    message: "information updated",
    information: {
      name: "Hamed Test",
      userName: "hamed",
      phoneNumber: "0999999999",
    },
  }),
);
r("/changeNumber", (req, res) =>
  res.json({
    status: "success",
    message: "number changed",
    data: { name: "Hamed Test", userName: "hamed", phoneNumber: "0988888888" },
  }),
);
r("/myPoints", (req, res) => res.json({ myPoints: 120.5, pointPrice: 50.5 }));

const coupon = (id, type, discount, seen) => ({
  id,
  type, // 'discount_coupon' | 'free_delivery_coupon'
  coupon_number: "CPN-" + String(id).padStart(4, "0"),
  discount,
  remainingTime: LONG_TIME,
  seen,
  created_at: iso(1),
});
r("/coupons", (req, res) =>
  res.json([
    coupon(1, "discount_coupon", 10, false),
    coupon(2, "discount_coupon", 25, true),
    coupon(3, "discount_coupon", 5.5, true),
  ]),
);
r("/freeDeliveryCoupons", (req, res) =>
  res.json([
    coupon(11, "free_delivery_coupon", 0, false),
    coupon(12, "free_delivery_coupon", 0, true),
  ]),
);
r("/gifts", (req, res) =>
  res.json([
    {
      id: 1,
      description: "a free chicken sandwich",
      gift_number: "GFT-0001",
      seen: false,
      created_at: iso(1),
    },
    {
      id: 2,
      description: "a free hot chocolate",
      gift_number: "GFT-0002",
      seen: true,
      created_at: iso(4),
    },
  ]),
);
router.all(/^\/setAsSeen(\/.*)?$/, (req, res) =>
  res.json({ status: "success" }),
);

// ---------------------------------------------------------------- HOME
// app calls  $baseURL/rate/1/rate=1  -> returns a full item
router.all(/^\/rate(\/.*)?$/, (req, res) =>
  res.json({ ...items[0], my_rate: 5 }),
);
r("/storeStatus", (req, res) => res.json({ status: "open" }));
r("/discounts", (req, res) => res.json(items.filter((i) => i.discount)));
r("/offers", (req, res) => res.json(offers));
r("/getAdvertisements", (req, res) =>
  res.json([
    {
      image:
        "https://www.themealdb.com/images/media/meals/44bzep1761848278.jpg",
    },
    {
      image:
        "https://www.themealdb.com/images/media/meals/stnxzp1784835840.jpg",
    },
    {
      image:
        "https://www.thecocktaildb.com/images/media/drink/3nbu4a1487603196.jpg",
    },
    {
      image:
        "https://www.themealdb.com/images/media/meals/vtqxtu1511784197.jpg",
    },
  ]),
);
r("/getTopItems", (req, res) =>
  res.json([
    items[8],
    items[10],
    items[0],
    items[21],
    items[26],
    items[13],
    items[5],
  ]),
);
r("/newItem", (req, res) =>
  res.json([
    items[29],
    items[24],
    items[17],
    items[22],
    items[12],
    items[3],
    items[19],
  ]),
);

// ---------------------------------------------------------------- NOTIFICATIONS
r("/hasRunningOrders", (req, res) => res.json({ data: true }));
r("/hasNewGifts", (req, res) => res.json({ data: true }));
r("/hasNewCoupons", (req, res) => res.json({ data: true }));
r("/hasCanceledOrders", (req, res) => res.json({ data: false }));

// ---------------------------------------------------------------- ORDERS
r("/cancelOrder", (req, res) =>
  res.json({ status: "success", message: "order canceled" }),
);
r("/order", (req, res) =>
  res.json({ status: "success", message: "order placed successfully" }),
);

router.all("/discountCode/:code", (req, res) => {
  const code = req.params.code;
  if (code.toLowerCase() === "bad") {
    return res.json({
      discount: 0.5,
      message: "invalid code",
      valid: false,
      code,
    });
  }
  res.json({ discount: 15.5, message: "code applied", valid: true, code });
});

const runningOrder = (id, { canceled = false } = {}) => ({
  order_id: id,
  can_cancel: !canceled,
  final_price: 52000.5,
  is_gift: false,
  order_status: canceled ? "Canceled" : "In Progress",
  order_payment_status: canceled ? "unpaid" : "paid",
  created_at: iso(0),
  delivered_at: null,
  free_delivery_coupons: false,
  used_discount_code: { SAVE15: 15.5 }, // Map<String,double>: must be fractional
  used_coupons: { "coupon-1": 10.5 },
  cancel_message: canceled ? "The restaurant is closed right now" : null,
  delivery: {
    method: "delivery",
    delivery_payment_status: "unpaid",
    location_details: {
      name: "Al-Mazzeh, Damascus",
      latitude: 33.5138,
      longitude: 36.2765,
      distance: 3200.5,
      price: 8000.5,
    },
  },
  payment: {
    method: "cash on delivery",
    payment_status: canceled ? "unpaid" : "paid",
    details: null,
  },
  content: {
    content_price: 44000.5,
    items: [
      {
        id: 1,
        name: "Chicken Sandwich",
        count: 2,
        price: 30000.5,
        chosenPreference: ["Large", "Extra sauce"],
      },
      {
        id: 27,
        name: "Banana Milk Shake",
        count: 1,
        price: 6000.5,
        chosenPreference: [],
      },
    ],
    offers: [
      {
        id: 2,
        name: "Student Offer",
        count: 1,
        price: 18000.5,
        description: "1 sandwich + 1 drink",
      },
    ],
    gifts: [
      { id: 1, number: "GFT-0001", description: "a free chicken sandwich" },
    ],
  },
});

r("/RO", (req, res) => res.json([runningOrder(201), runningOrder(202)]));
r("/CO", (req, res) => res.json([runningOrder(150, { canceled: true })]));

// ---------------------------------------------------------------- SERVICES / ITEMS
r("/services", (req, res) => res.json(services));
router.all("/serviceCategory/:serviceId", (req, res) => {
  const sid = Number(req.params.serviceId);
  res.json(categories.filter((c) => c.service.id === sid));
});
router.all("/servicesCategory/:serviceId/:categoryId", (req, res) => {
  const cid = Number(req.params.categoryId);
  res.json(items.filter((i) => i.category.id === cid));
});
router.all("/search/:name", (req, res) => {
  const q = String(req.params.name).toLowerCase();
  res.json(items.filter((i) => i.name.toLowerCase().includes(q)));
});

// ---------------------------------------------------------------- LOCATION
r("/pricePerMeter", (req, res) => res.json({ price: 2.5 })); // must be fractional (Dart double)

// ---------------------------------------------------------------- misc
router.get("/", (req, res) => res.send("ForkMate mock API is running"));

app.use("/api/hamed", router);
app.use("/", router);

app.use((req, res) =>
  res
    .status(404)
    .json({ status: "error", message: "route not found: " + req.originalUrl }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Mock server listening on " + PORT));
