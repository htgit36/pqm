import "server-only";

// Lấy bài đăng có ảnh từ fanpage qua Facebook Graph API.
// Cần FACEBOOK_PAGE_ID và FACEBOOK_PAGE_TOKEN (Page Access Token dài hạn).
// Kết quả được lưu đệm 1 giờ nên bài mới trên fanpage tự xuất hiện trên website.

export type FbAlbum = {
  id: string;
  message: string;
  date: string;
  url: string;
  images: string[];
};

type Media = { image?: { src?: string } };
type Attachment = { media_type?: string; media?: Media; subattachments?: { data?: Attachment[] } };
type FbPost = {
  id: string;
  message?: string;
  created_time: string;
  permalink_url?: string;
  full_picture?: string;
  attachments?: { data?: Attachment[] };
};

const VERSION = process.env.FACEBOOK_GRAPH_VERSION || "v23.0";

function imagesOf(post: FbPost) {
  const out: string[] = [];
  for (const a of post.attachments?.data ?? []) {
    const subs = a.subattachments?.data ?? [];
    for (const s of subs) if (s.media_type === "photo" && s.media?.image?.src) out.push(s.media.image.src);
    if (!subs.length && a.media_type === "photo" && a.media?.image?.src) out.push(a.media.image.src);
  }
  if (!out.length && post.full_picture) out.push(post.full_picture);
  return out;
}

export function facebookConfigured() {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN);
}

export async function getFacebookAlbums(limit = 30): Promise<FbAlbum[]> {
  const { FACEBOOK_PAGE_ID: pageId, FACEBOOK_PAGE_TOKEN: token } = process.env;
  if (!pageId || !token) return [];

  const fields = "id,message,created_time,permalink_url,full_picture,attachments{media_type,media,subattachments.limit(50){media_type,media}}";
  const url = `https://graph.facebook.com/${VERSION}/${pageId}/posts?fields=${encodeURIComponent(fields)}&limit=${limit}&access_token=${encodeURIComponent(token)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600, tags: ["facebook"] } });
    if (!res.ok) {
      console.error("[facebook]", res.status, (await res.text()).slice(0, 300));
      return [];
    }
    const json = (await res.json()) as { data?: FbPost[] };
    return (json.data ?? [])
      .map((p) => ({
        id: p.id,
        message: (p.message ?? "").trim(),
        date: p.created_time,
        url: p.permalink_url ?? `https://www.facebook.com/${p.id}`,
        images: imagesOf(p),
      }))
      .filter((a) => a.images.length > 0);
  } catch (err) {
    console.error("[facebook]", err);
    return [];
  }
}
