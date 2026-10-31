// Dữ liệu khởi tạo lần đầu (lấy từ Hồ sơ năng lực Phú Quốc Media).
// Ảnh bìa hiện là ảnh tạm từ website cũ — thay trong trang Admin.

const drive = (id: string) => `https://drive.google.com/drive/folders/${id}`;

export const seedServices = [
  {
    slug: "chup-anh-quay-phim-su-kien",
    titleVi: "Chụp ảnh & Quay phim Sự kiện",
    titleEn: "Event Photography & Film",
    summaryVi:
      "Giải pháp toàn diện cho hội nghị quốc tế, Gala Dinner, Roadshow, Team Building và đoàn khách tour quy mô lớn — nắm bắt những khoảnh khắc đắt giá, truyền tải mạnh mẽ không khí và thông điệp sự kiện.",
    summaryEn:
      "End-to-end coverage for international conferences, gala dinners, roadshows, team building and large tour groups — capturing the defining moments and the energy of every event.",
    bodyVi: `## Ghi lại trọn vẹn tinh thần sự kiện

Từ hội nghị khách hàng, lễ ký kết, ra mắt sản phẩm đến Gala Dinner và tiệc tất niên — ê-kíp Phú Quốc Media có mặt sớm, nắm kịch bản chương trình và chủ động kiểm soát mọi tình huống để không bỏ lỡ khoảnh khắc nào.

### Hạng mục
- Chụp ảnh sự kiện, hội nghị, họp báo, lễ ký kết
- Quay phim phóng sự, highlight, phỏng vấn tại sự kiện
- Livestream đa máy quay
- Trả ảnh nhanh trong ngày, highlight video sau 24 giờ

### Vì sao chọn chúng tôi
- Ê-kíp bản địa am hiểu địa hình, ánh sáng tại Phú Quốc
- Hệ thống máy ảnh Fujifilm cao cấp, gimbal DJI, drone/FPV chuyên dụng
- Hợp đồng rõ ràng, có hóa đơn tài chính hợp lệ`,
    bodyEn: `## Capturing the full spirit of your event

From client conferences, signing ceremonies and product launches to gala dinners and year-end parties — our crew arrives early, knows the run-of-show and stays in control so no moment is missed.

### Scope
- Event, conference, press and signing ceremony photography
- Documentary, highlight and on-site interview filming
- Multi-camera livestream
- Same-day photo delivery, highlight video within 24 hours

### Why us
- A local crew that knows Phu Quoc's terrain and light
- Premium Fujifilm cameras, DJI gimbals, professional drones and FPV
- Clear contracts and valid financial invoices`,
    coverImage: "/images/daochienbinh-n3-370.webp",
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "san-xuat-phim-doanh-nghiep",
    titleVi: "Sản xuất Phim Doanh nghiệp",
    titleEn: "Corporate Films & TVC",
    summaryVi:
      "Quay dựng TVC, video giới thiệu dịch vụ, resort, khách sạn với kịch bản trau chuốt và hậu kỳ kỹ lưỡng.",
    summaryEn:
      "TVCs and brand films for services, resorts and hotels — carefully scripted and meticulously finished in post.",
    bodyVi: `## Kể câu chuyện thương hiệu qua từng thước phim

Chúng tôi đồng hành từ ý tưởng, kịch bản, tiền kỳ đến hậu kỳ — tạo nên những thước phim giàu cảm xúc, đúng thông điệp và sẵn sàng cho mọi nền tảng.

### Hạng mục
- TVC quảng cáo, phim thương hiệu
- Video giới thiệu resort, khách sạn, nhà hàng
- Phim truyền thông, chuỗi video ngắn (Reels/TikTok)
- Phim tài liệu doanh nghiệp, phỏng vấn lãnh đạo

### Quy trình
1. Tiếp nhận brief, đề xuất ý tưởng & kịch bản
2. Lên kế hoạch bối cảnh, nhân sự, thiết bị
3. Ghi hình với ê-kíp chuyên nghiệp
4. Dựng phim, chỉnh màu, âm thanh, bàn giao đa định dạng`,
    bodyEn: `## Telling your brand story frame by frame

We work with you from concept and script through pre-production to post — crafting emotive films with the right message, ready for every platform.

### Scope
- TVCs and brand films
- Resort, hotel and restaurant showcase videos
- Campaign films and short-form series (Reels/TikTok)
- Corporate documentaries and leadership interviews

### Process
1. Brief, creative concept and script
2. Location, crew and equipment planning
3. Production with a professional crew
4. Edit, color grade, sound and multi-format delivery`,
    coverImage: "/images/shri-cd-2020-26-result.webp",
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "flycam-drone-fpv",
    titleVi: "Flycam / Drone / FPV",
    titleEn: "Drone & FPV",
    summaryVi:
      "Những thước phim toàn cảnh từ trên cao ngoạn mục, tạo quy mô hoành tráng và góc nhìn độc đáo mà máy quay mặt đất không thể thực hiện.",
    summaryEn:
      "Breathtaking aerial footage that adds scale and perspectives no ground camera can reach.",
    bodyVi: `## Góc nhìn từ trên cao của Đảo Ngọc

Drone và FPV mang đến quy mô, chuyển động và cảm xúc cho mọi sản phẩm — từ toàn cảnh sự kiện bên bờ biển đến những cú bay xuyên không gian đầy ấn tượng.

### Hạng mục
- Flycam toàn cảnh sự kiện, tour, team building
- FPV bay xuyên không gian resort, khách sạn
- Flycam dự án bất động sản, tiến độ công trình
- Ảnh & video 4K/5K từ trên cao`,
    bodyEn: `## The Pearl Island from above

Drones and FPV add scale, motion and emotion to any production — from sweeping beach-side event overviews to dramatic fly-throughs.

### Scope
- Aerial coverage of events, tours and team building
- FPV fly-throughs of resorts and hotels
- Real estate and construction progress aerials
- 4K/5K aerial stills and video`,
    coverImage: "/images/dji-0099.webp",
    featured: true,
    sortOrder: 3,
  },
  {
    slug: "in-anh-lay-ngay",
    titleVi: "In ảnh Sự kiện Lấy ngay",
    titleEn: "Instant Event Printing",
    summaryVi:
      "Điểm nhấn giúp gia tăng tương tác, mang lại món quà kỷ niệm sắc nét, chuyên nghiệp trao tận tay khách mời ngay tại sự kiện.",
    summaryEn:
      "A crowd-pleasing touchpoint that hands every guest a crisp, professional keepsake on the spot.",
    bodyVi: `## Món quà kỷ niệm trao tận tay khách mời

Hệ thống máy in kỹ thuật số Nhật Bản, công nghệ ép nhiệt 4 lớp cho màu sắc bền bỉ — khách mời nhận ảnh ngay tại sự kiện, có thể in kèm logo, khung thiết kế riêng theo thương hiệu.

### Hạng mục
- In ảnh lấy ngay tại sự kiện, tiệc, hội nghị
- Thiết kế khung ảnh theo nhận diện thương hiệu
- Photobooth, góc check-in`,
    bodyEn: `## A keepsake in every guest's hand

Japanese digital printers with 4-layer heat lamination for long-lasting color — guests receive their prints on the spot, with your logo or custom branded frames.

### Scope
- On-site instant printing at events, parties and conferences
- Branded print frame design
- Photobooth and check-in corners`,
    coverImage: "/images/in-anh-polaroid7.webp",
    featured: true,
    sortOrder: 4,
  },
  {
    slug: "chup-anh-teambuilding-gala-dinner",
    titleVi: "Chụp ảnh Team Building & Gala Dinner",
    titleEn: "Team Building & Gala Dinner",
    summaryVi: "Ghi lại năng lượng, tiếng cười và tinh thần đồng đội trên bãi biển Phú Quốc.",
    summaryEn: "Capturing the energy, laughter and team spirit on Phu Quoc's beaches.",
    bodyVi:
      "Ê-kíp nhiều máy theo sát từng trò chơi, từng khoảnh khắc — kết hợp flycam toàn cảnh và trả ảnh nhanh để đoàn chia sẻ ngay trong ngày.",
    bodyEn:
      "A multi-camera crew follows every game and every moment — combined with aerial coverage and fast delivery so the team can share the same day.",
    coverImage: "/images/deepc-101.webp",
    sortOrder: 5,
  },
  {
    slug: "chup-anh-city-tour-theo-doan",
    titleVi: "Chụp ảnh City Tour theo Đoàn",
    titleEn: "Group City Tour Photography",
    summaryVi: "Đồng hành cùng đoàn khách khám phá Phú Quốc, lưu giữ trọn vẹn hành trình.",
    summaryEn: "Travelling with your group across Phu Quoc and documenting the whole journey.",
    bodyVi: "Chúng tôi am hiểu các điểm đến, khung giờ ánh sáng đẹp nhất trên đảo để mỗi bức ảnh của đoàn đều là một kỷ niệm.",
    bodyEn: "We know the island's destinations and golden hours so every group photo becomes a memory.",
    coverImage: "/images/softwarepark-43.webp",
    sortOrder: 6,
  },
  {
    slug: "chup-anh-kien-truc-bat-dong-san",
    titleVi: "Chụp ảnh Kiến trúc & Bất động sản",
    titleEn: "Architecture & Real Estate",
    summaryVi: "Ảnh kiến trúc, nhà mẫu, căn hộ, khách sạn — chuẩn màu, chuẩn phối cảnh.",
    summaryEn: "Architecture, show units, apartments and hotels — true color, true perspective.",
    bodyVi: "Kỹ thuật HDR, ống kính tilt-shift và flycam giúp không gian hiện lên chân thực, sang trọng, sẵn sàng cho truyền thông bán hàng.",
    bodyEn: "HDR technique, perspective control and aerials present spaces truthfully and beautifully, ready for sales marketing.",
    coverImage: "/images/img-4181-hdr.webp",
    sortOrder: 7,
  },
  {
    slug: "chup-anh-couple-gia-dinh",
    titleVi: "Chụp ảnh Couple & Gia đình",
    titleEn: "Couples & Family",
    summaryVi: "Những khung hình tự nhiên, giàu cảm xúc bên hoàng hôn Phú Quốc.",
    summaryEn: "Natural, heartfelt portraits against Phu Quoc's sunsets.",
    bodyVi: "Gợi ý địa điểm, trang phục và khung giờ đẹp nhất — để chuyến đi của bạn có một bộ ảnh đáng nhớ.",
    bodyEn: "We suggest locations, outfits and the best light — so your trip comes home with photos worth keeping.",
    coverImage: "/images/gia-dinh.webp",
    sortOrder: 8,
  },
];

type SeedProject = {
  slug: string;
  titleVi: string;
  titleEn: string;
  client: string | null;
  category: string;
  kind: "video" | "photo";
  year: number | null;
  coverImage: string;
  externalUrl: string | null;
  featured?: boolean;
};

const p: SeedProject[] = [
  // — Video (Hồ sơ năng lực, trang 9–11)
  { slug: "vinmec-phim-dot-quy-bac-si-oi", titleVi: "Phim truyền thông “Đột Quỵ” & chuỗi reel “Bác Sĩ Ơi”", titleEn: "“Stroke” awareness film & “Doctor, Please” reel series", client: "Vinmec Phú Quốc", category: "corporate", kind: "video", year: null, coverImage: "/images/dscf0477.webp", externalUrl: drive("1Uq_Qp4brcyKYpydmv8VGizLFbBVCdpM-"), featured: true },
  { slug: "vinmec-phu-quoc-video", titleVi: "Vinmec Phú Quốc", titleEn: "Vinmec Phu Quoc", client: "Vinmec Phú Quốc", category: "corporate", kind: "video", year: null, coverImage: "/images/pqm-1.webp", externalUrl: drive("1WKxtKfieA_4Dyu6ldjtIOPz15z4SCy4C") },
  { slug: "intel-sale-challenge-hps-1h23", titleVi: "Intel Sale Challenge HPS 1H23", titleEn: "Intel Sale Challenge HPS 1H23", client: "Intel", category: "event", kind: "video", year: 2023, coverImage: "/images/daochienbinh-n3-370.webp", externalUrl: drive("1aA-DUkfE5qd1b3Ze_60CalJUXTcb3nqL"), featured: true },
  { slug: "countdown-vinpearl", titleVi: "Countdown Vinpearl", titleEn: "Vinpearl Countdown", client: "Vinpearl", category: "event", kind: "video", year: null, coverImage: "/images/dscf0024.webp", externalUrl: null, featured: true },
  { slug: "dao-chien-binh-phu-quoc", titleVi: "Đảo Chiến Binh – Phú Quốc", titleEn: "Warrior Island – Phu Quoc", client: null, category: "teambuilding", kind: "video", year: null, coverImage: "/images/softwarepark-190.webp", externalUrl: drive("1dpmqx87YX7JiFJCrssvOnfdFhbuFCLQj") },
  { slug: "actioncoach", titleVi: "ActionCOACH", titleEn: "ActionCOACH", client: "ActionCOACH", category: "event", kind: "video", year: null, coverImage: "/images/dscf8017.webp", externalUrl: drive("1kJs7TZ-89-3S716a3h305fJrq2nU6BLX") },
  { slug: "elsa-company-trip", titleVi: "ELSA Company Trip", titleEn: "ELSA Company Trip", client: "ELSA", category: "teambuilding", kind: "video", year: null, coverImage: "/images/htam1012.webp", externalUrl: drive("19278eha_w3ES37jyKpMytgQsw3LBD4Cn") },
  { slug: "khai-xuan-nhu-y-vinwonders", titleVi: "Khai Xuân Như Ý – VinWonders Phú Quốc", titleEn: "Lunar New Year Opening – VinWonders Phu Quoc", client: "VinWonders Phú Quốc", category: "hospitality", kind: "video", year: null, coverImage: "/images/dji-0952.webp", externalUrl: null },
  { slug: "edurun-2025", titleVi: "EDURUN 2025", titleEn: "EDURUN 2025", client: "Edurun", category: "sport", kind: "video", year: 2025, coverImage: "/images/softwarepark-43.webp", externalUrl: drive("1wzS_TL_XGx1P-ytU5oE6a1J8SMZ10yGb"), featured: true },
  { slug: "vinschool-phu-quoc", titleVi: "Vinschool Phú Quốc", titleEn: "Vinschool Phu Quoc", client: "Vinschool", category: "corporate", kind: "video", year: null, coverImage: "/images/phuquocmedia-8.webp", externalUrl: drive("1ZdmKSyz1lgPloGFRpsvSV_riLHwSVZkH") },
  { slug: "batdongsan-offsite-teambuilding-gala", titleVi: "Batdongsan Offsite – Teambuilding & Gala", titleEn: "Batdongsan Offsite – Team Building & Gala", client: "Batdongsan.com.vn", category: "teambuilding", kind: "video", year: null, coverImage: "/images/deepc-101.webp", externalUrl: drive("1XICk27tcCSvIDNqlOiaP6X2SZRYTESyU"), featured: true },
  { slug: "mbland", titleVi: "MBLand", titleEn: "MBLand", client: "MBLand", category: "event", kind: "video", year: null, coverImage: "/images/dscf1551.webp", externalUrl: null },
  // — Hình ảnh (Hồ sơ năng lực, trang 12–14)
  { slug: "le-ky-ket-ice-jungle", titleVi: "Lễ ký kết hợp tác chiến lược truyền thông Ice Jungle", titleEn: "Ice Jungle strategic media partnership signing", client: "Ice Jungle", category: "event", kind: "photo", year: null, coverImage: "/images/pqm-1.webp", externalUrl: drive("1DKtJJgnYsCzrEukMCWvK1yuP5MCVVQYD"), featured: true },
  { slug: "meyhomes", titleVi: "Lễ ký kết Meyhomes", titleEn: "Meyhomes signing ceremony", client: "Meyhomes", category: "event", kind: "photo", year: null, coverImage: "/images/dscf0477.webp", externalUrl: drive("1YIv_U_9tpGaA4X4kuZspAzfWRJlQ2iEl") },
  { slug: "giai-chay-vtv-vinpearl", titleVi: "Giải chạy VTV – Vinpearl", titleEn: "VTV – Vinpearl Run", client: "VTV · Vinpearl", category: "sport", kind: "photo", year: null, coverImage: "/images/softwarepark-43.webp", externalUrl: drive("1iQhqkCXnz3sz_H0dT0nKa5gwIzjuFeLn"), featured: true },
  { slug: "tet-2024-tinh-hoa-viet-nam", titleVi: "Tết 2024 – Tinh Hoa Việt Nam", titleEn: "Tet 2024 – Essence of Vietnam", client: null, category: "event", kind: "photo", year: 2024, coverImage: "/images/shri-cd-2020-26-result.webp", externalUrl: null },
  { slug: "friendship-golf", titleVi: "Friendship Golf", titleEn: "Friendship Golf", client: null, category: "sport", kind: "photo", year: null, coverImage: "/images/dji-0099.webp", externalUrl: drive("14R8vjfkwlXKTX0pZbZ7Zw2aP7CB1jnHK") },
  { slug: "vinpearl-golf", titleVi: "Vinpearl Golf", titleEn: "Vinpearl Golf", client: "Vinpearl", category: "sport", kind: "photo", year: null, coverImage: "/images/dji-0952.webp", externalUrl: drive("156ZZlJpew4G8LT-23v4JjOJAkEp5MjHO") },
  { slug: "thuy-cung-vinwonders-phu-quoc", titleVi: "Thủy cung VinWonders Phú Quốc", titleEn: "VinWonders Phu Quoc Aquarium", client: "VinWonders Phú Quốc", category: "hospitality", kind: "photo", year: null, coverImage: "/images/img-4118.webp", externalUrl: drive("1X9gn9enNxWo3GVKDnkojHfo7Via4rTxo") },
  { slug: "bidv-gala-dinner", titleVi: "BIDV Gala Dinner", titleEn: "BIDV Gala Dinner", client: "BIDV", category: "event", kind: "photo", year: null, coverImage: "/images/dscf0024.webp", externalUrl: null, featured: true },
  { slug: "le-ban-giao-xe-cuu-thuong-115", titleVi: "Lễ bàn giao xe cứu thương 115", titleEn: "115 Ambulance handover ceremony", client: "Vinmec Phú Quốc", category: "event", kind: "photo", year: null, coverImage: "/images/pqm-1.webp", externalUrl: drive("1SxGwMxbUulATRm2u7IyvRh-ME4JaugXD") },
  { slug: "vinmec-phu-quoc-hinh-anh", titleVi: "Vinmec Phú Quốc", titleEn: "Vinmec Phu Quoc", client: "Vinmec Phú Quốc", category: "corporate", kind: "photo", year: null, coverImage: "/images/dscf0477.webp", externalUrl: drive("1N7UobQerIvB4rFLyFAE65yHnKKm97XDt") },
  { slug: "traveloka-gm-connect", titleVi: "Traveloka GM Connect", titleEn: "Traveloka GM Connect", client: "Traveloka", category: "event", kind: "photo", year: null, coverImage: "/images/daochienbinh-n3-370.webp", externalUrl: drive("1vIM9jK525gV7Fjg9cLc-ghWNhdfZd9h3") },
  { slug: "trip-com-market-update-2025", titleVi: "Trip.com Vietnam – Market Update 2025 Meeting", titleEn: "Trip.com Vietnam – Market Update 2025 Meeting", client: "Trip.com", category: "event", kind: "photo", year: 2025, coverImage: "/images/dscf8017.webp", externalUrl: null },
];

export const seedProjects = p.map((x, i) => ({
  ...x,
  featured: x.featured ?? false,
  gallery: [] as string[],
  sortOrder: i + 1,
  summaryVi: x.client ? `Dự án thực hiện cho ${x.client}.` : null,
  summaryEn: x.client ? `Produced for ${x.client}.` : null,
}));

export const seedClients = [
  "Vinpearl",
  "Vinmec",
  "Vinschool",
  "VinWonders",
  "Sheraton Phú Quốc",
  "BIDV",
  "Intel",
  "Traveloka",
  "Trip.com",
  "ActionCOACH",
  "ELSA",
  "MBLand",
  "Meyhomes",
  "Batdongsan.com.vn",
].map((name, i) => ({ name, sortOrder: i + 1 }));

export const seedPosts = [
  {
    slug: "kinh-nghiem-chon-don-vi-quay-phim-su-kien-tai-phu-quoc",
    titleVi: "5 điều cần biết khi chọn đơn vị chụp ảnh, quay phim sự kiện tại Phú Quốc",
    titleEn: "5 things to know when hiring an event photo & video team in Phu Quoc",
    excerptVi:
      "Thời tiết, ánh sáng, di chuyển giữa các resort và yêu cầu hóa đơn — những yếu tố quyết định chất lượng tư liệu sự kiện của bạn trên đảo.",
    excerptEn:
      "Weather, light, moving between resorts and invoicing — the factors that decide the quality of your event coverage on the island.",
    bodyVi: `Tổ chức sự kiện tại Phú Quốc mang đến khung cảnh tuyệt đẹp, nhưng cũng đặt ra những thách thức riêng cho khâu ghi hình.

## 1. Ưu tiên ê-kíp bản địa
Ê-kíp tại đảo hiểu địa hình, thời tiết theo mùa và khung giờ ánh sáng đẹp nhất — đồng thời giảm đáng kể chi phí di chuyển, lưu trú.

## 2. Kiểm tra thiết bị dự phòng
Sự kiện ngoài trời ven biển cần máy ảnh chống chịu tốt, thẻ nhớ và pin dự phòng, cùng drone đủ điều kiện bay.

## 3. Thống nhất kịch bản và danh sách khoảnh khắc
Gửi trước run-of-show, danh sách khách VIP và các khoảnh khắc bắt buộc (cắt băng, ký kết, trao giải) để ê-kíp bố trí vị trí máy.

## 4. Thời gian trả sản phẩm
Hỏi rõ thời gian trả ảnh nhanh trong ngày và highlight video — đặc biệt khi cần đăng truyền thông ngay sau sự kiện.

## 5. Pháp lý và hóa đơn
Làm việc với đơn vị có tư cách pháp nhân, hợp đồng rõ ràng và hóa đơn tài chính hợp lệ giúp quy trình thanh toán của doanh nghiệp thuận tiện.`,
    bodyEn: `Hosting an event in Phu Quoc gives you stunning scenery — and a few challenges for your production team.

## 1. Prefer a local crew
An island-based crew knows the terrain, seasonal weather and best light — and saves you travel and lodging costs.

## 2. Check backup equipment
Beach-side outdoor events need weather-ready cameras, spare cards and batteries, and drones cleared to fly.

## 3. Share the run-of-show and must-have moments
Send the program, VIP list and key moments (ribbon cutting, signing, awards) so the crew can plan camera positions.

## 4. Delivery timelines
Agree on same-day photo delivery and highlight video timing — especially if you need to publish right after the event.

## 5. Contracts and invoicing
Working with a registered company with clear contracts and valid financial invoices keeps your accounting simple.`,
    coverImage: "/images/daochienbinh-n3-370.webp",
    publishedAt: new Date("2026-09-15T09:00:00+07:00"),
  },
  {
    slug: "khung-gio-vang-chup-anh-phu-quoc",
    titleVi: "Khung giờ vàng để chụp ảnh đẹp nhất tại Phú Quốc",
    titleEn: "The golden hours for the best photos in Phu Quoc",
    excerptVi: "Bình minh ở Bãi Sao, hoàng hôn ở Dinh Cậu hay Sunset Town — chọn đúng thời điểm để bộ ảnh của bạn rực rỡ nhất.",
    excerptEn: "Sunrise at Sao Beach, sunset at Dinh Cau or Sunset Town — pick the right moment for your most radiant photos.",
    bodyVi: `Ánh sáng quyết định phần lớn chất lượng một bức ảnh ngoài trời.

## Bình minh (5:30 – 7:00)
Bờ Đông như Bãi Sao, Hàm Ninh đón ánh sáng dịu, biển lặng — lý tưởng cho ảnh gia đình và couple.

## Hoàng hôn (17:00 – 18:30)
Bờ Tây với Dinh Cậu, Sunset Town, Bãi Trường cho bầu trời cam tím đặc trưng của Phú Quốc.

## Giữa trưa
Phù hợp cho flycam vì nước biển trong và xanh nhất, nhưng nên tránh chụp chân dung dưới nắng gắt.`,
    bodyEn: `Light decides most of what makes an outdoor photo great.

## Sunrise (5:30 – 7:00)
The east coast — Sao Beach, Ham Ninh — offers soft light and calm water, ideal for family and couple sessions.

## Sunset (17:00 – 18:30)
The west coast — Dinh Cau, Sunset Town, Long Beach — delivers Phu Quoc's signature orange and violet skies.

## Midday
Great for drone work when the water is at its clearest, but avoid portraits in harsh sun.`,
    coverImage: "/images/dscf1551.webp",
    publishedAt: new Date("2026-10-10T09:00:00+07:00"),
  },
];
