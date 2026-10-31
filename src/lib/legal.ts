import type { Locale } from "./i18n";

type Section = { h: string; p: string[] };
export type LegalDoc = { title: string; lead: string; updated: string; sections: Section[] };

const company = (l: Locale) => (l === "en" ? "Phu Quoc Media Communications Co., Ltd." : "Công ty TNHH MTV Truyền thông Phú Quốc Media");

export function getLegal(kind: "privacy" | "terms", locale: Locale, c: { taxCode: string; address: string; phone: string; email: string }): LegalDoc {
  const contact =
    locale === "en"
      ? `${company(locale)} — Tax code ${c.taxCode} — ${c.address} — ${c.phone} — ${c.email}`
      : `${company(locale)} — MST ${c.taxCode} — ${c.address} — ${c.phone} — ${c.email}`;

  if (kind === "privacy") {
    return locale === "en"
      ? {
          title: "Privacy Policy",
          lead: "How Phu Quoc Media collects, uses and protects your personal data.",
          updated: "Last updated: 1 November 2026",
          sections: [
            { h: "1. Who we are", p: [contact] },
            { h: "2. Data we collect", p: ["Details you submit through the quote form: full name, phone number, email, company, service of interest, event date and your message.", "Technical data collected through analytics cookies: pages viewed, device and browser type, approximate location and clicks on contact buttons."] },
            { h: "3. Why we use it", p: ["To contact you, advise on services and prepare quotes; to perform contracts; to improve the website and our services; and to meet legal obligations."] },
            { h: "4. Legal basis", p: ["We process your data on the basis of your consent (ticking the box on the form), in line with Decree 13/2023/ND-CP on personal data protection. You may withdraw consent at any time."] },
            { h: "5. Sharing", p: ["We do not sell your data. We only share it with service providers that help us operate the website (hosting, email, analytics) under confidentiality obligations, or when required by competent authorities."] },
            { h: "6. Retention", p: ["Quote requests are kept for as long as needed to serve you and for the periods required by law, then deleted or anonymised."] },
            { h: "7. Cookies", p: ["Google Analytics and Meta Pixel (if enabled) use cookies to measure visits and load only after you accept. You can block or delete cookies in your browser settings at any time."] },
            { h: "8. Your rights", p: [`You may request access, correction, deletion or restriction of your data, or withdraw consent, by contacting us at ${c.email} or ${c.phone}.`] },
            { h: "9. Changes", p: ["We may update this policy; the latest version is always published on this page."] },
          ],
        }
      : {
          title: "Chính sách bảo mật",
          lead: "Cách Phú Quốc Media thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.",
          updated: "Cập nhật lần cuối: 01/11/2026",
          sections: [
            { h: "1. Đơn vị thu thập", p: [contact] },
            { h: "2. Dữ liệu chúng tôi thu thập", p: ["Thông tin bạn gửi qua biểu mẫu báo giá: họ tên, số điện thoại, email, công ty, dịch vụ quan tâm, ngày dự kiến và nội dung yêu cầu.", "Dữ liệu kỹ thuật qua cookie phân tích: trang đã xem, loại thiết bị và trình duyệt, vị trí tương đối và lượt bấm các nút liên hệ."] },
            { h: "3. Mục đích sử dụng", p: ["Liên hệ, tư vấn dịch vụ và lập báo giá; thực hiện hợp đồng; cải thiện website và chất lượng dịch vụ; tuân thủ nghĩa vụ pháp lý."] },
            { h: "4. Căn cứ xử lý", p: ["Chúng tôi xử lý dữ liệu dựa trên sự đồng ý của bạn (tích chọn ở biểu mẫu), phù hợp Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Bạn có thể rút lại sự đồng ý bất cứ lúc nào."] },
            { h: "5. Chia sẻ dữ liệu", p: ["Chúng tôi không bán dữ liệu của bạn. Dữ liệu chỉ được chia sẻ với đơn vị cung cấp dịch vụ vận hành website (lưu trữ, email, phân tích) theo cam kết bảo mật, hoặc khi cơ quan có thẩm quyền yêu cầu."] },
            { h: "6. Thời gian lưu trữ", p: ["Yêu cầu báo giá được lưu trong thời gian cần thiết để phục vụ bạn và theo thời hạn pháp luật yêu cầu, sau đó được xóa hoặc ẩn danh."] },
            { h: "7. Cookie", p: ["Google Analytics và Meta Pixel (nếu được bật) dùng cookie để đo lượng truy cập và chỉ tải sau khi bạn chấp nhận. Bạn có thể chặn hoặc xóa cookie trong cài đặt trình duyệt bất cứ lúc nào."] },
            { h: "8. Quyền của bạn", p: [`Bạn có quyền yêu cầu truy cập, chỉnh sửa, xóa, hạn chế xử lý dữ liệu hoặc rút lại sự đồng ý bằng cách liên hệ ${c.email} hoặc ${c.phone}.`] },
            { h: "9. Thay đổi chính sách", p: ["Chúng tôi có thể cập nhật chính sách này; phiên bản mới nhất luôn được đăng tại trang này."] },
          ],
        };
  }

  return locale === "en"
    ? {
        title: "Terms of Use",
        lead: "Please read these terms before using the Phu Quoc Media website.",
        updated: "Last updated: 1 November 2026",
        sections: [
          { h: "1. Operator", p: [contact] },
          { h: "2. Purpose of the website", p: ["This website introduces our services and lets you request a quote. Information on the site is for reference and is not a binding offer; services and prices are confirmed in a written quote and contract."] },
          { h: "3. Intellectual property", p: ["Photos, videos, text, logos and design on this website belong to Phu Quoc Media or are used with permission. You may not copy, republish or use them commercially without our written consent."] },
          { h: "4. Your use of the site", p: ["You agree not to disrupt the website, attempt unauthorised access, or submit false or unlawful information through the forms."] },
          { h: "5. Third-party links", p: ["The website may link to third-party sites (social networks, maps, partner sites). We are not responsible for their content or privacy practices."] },
          { h: "6. Disclaimer", p: ["We strive to keep information accurate and up to date but do not guarantee the website will be uninterrupted or error-free."] },
          { h: "7. Governing law", p: ["These terms are governed by the laws of Vietnam. Disputes are first resolved through negotiation."] },
        ],
      }
    : {
        title: "Điều khoản sử dụng",
        lead: "Vui lòng đọc kỹ các điều khoản trước khi sử dụng website Phú Quốc Media.",
        updated: "Cập nhật lần cuối: 01/11/2026",
        sections: [
          { h: "1. Đơn vị vận hành", p: [contact] },
          { h: "2. Mục đích website", p: ["Website giới thiệu dịch vụ và tiếp nhận yêu cầu báo giá. Thông tin trên website mang tính tham khảo, không phải đề nghị ràng buộc; dịch vụ và giá được xác nhận bằng báo giá và hợp đồng bằng văn bản."] },
          { h: "3. Quyền sở hữu trí tuệ", p: ["Hình ảnh, video, nội dung, logo và thiết kế trên website thuộc Phú Quốc Media hoặc được sử dụng với sự cho phép. Bạn không được sao chép, đăng lại hoặc sử dụng cho mục đích thương mại khi chưa có văn bản đồng ý của chúng tôi."] },
          { h: "4. Trách nhiệm người dùng", p: ["Bạn cam kết không gây gián đoạn website, không truy cập trái phép và không gửi thông tin sai sự thật hoặc vi phạm pháp luật qua các biểu mẫu."] },
          { h: "5. Liên kết bên thứ ba", p: ["Website có thể liên kết tới trang bên thứ ba (mạng xã hội, bản đồ, website đối tác). Chúng tôi không chịu trách nhiệm về nội dung và chính sách của các trang đó."] },
          { h: "6. Miễn trừ trách nhiệm", p: ["Chúng tôi nỗ lực giữ thông tin chính xác và cập nhật nhưng không bảo đảm website hoạt động liên tục hoặc không có lỗi."] },
          { h: "7. Luật áp dụng", p: ["Điều khoản này chịu sự điều chỉnh của pháp luật Việt Nam. Tranh chấp được ưu tiên giải quyết bằng thương lượng."] },
        ],
      };
}
