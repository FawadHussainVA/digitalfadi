// Private Cloudflare Worker. Reachable only via a Pages service binding.
// Send to the verified Gmail destination; fawad@digitalfadi.com stays the public address.
export default {
  async fetch(request, env) {
    if (request.method !== "POST" || new URL(request.url).pathname !== "/send") {
      return new Response("Not found", { status: 404 });
    }
    if (!env.EMAIL || typeof env.EMAIL.send !== "function") {
      return Response.json({ success: false, error: "EMAIL binding missing" }, { status: 503 });
    }
    let data;
    try { data = await request.json(); }
    catch (_) { return Response.json({ success: false, error: "Invalid payload" }, { status: 400 }); }
    if (!data || typeof data.subject !== "string" || typeof data.text !== "string" ||
        data.subject.length > 160 || data.text.length > 12000 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.replyTo || ""))) {
      return Response.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }
    try {
      const receipt = await env.EMAIL.send({
        from: "fawad@digitalfadi.com",
        to: "zaheer.geoz@gmail.com",
        replyTo: data.replyTo,
        subject: data.subject,
        text: data.text
      });
      return Response.json({ success: true, id: receipt?.messageId || null });
    } catch (error) {
      console.error("Cloudflare verified-destination email failed", error?.code || "", String(error?.message || error).slice(0,180));
      return Response.json({ success: false, error: "Delivery failed" }, { status: 502 });
    }
  }
};
