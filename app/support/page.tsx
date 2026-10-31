import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "帮助" };

const FAQ: { id?: string; q: string; a: React.ReactNode }[] = [
  {
    q: "支持哪些系统和宿主？",
    a: (
      <p>
        macOS（Intel 和 Apple 芯片）和 Windows 64 位。格式是 VST3 和 AU（AU 只在 Mac 上），能在 FL Studio、Ableton Live、Logic Pro、Studio One、Cubase、Reaper 等常见宿主里使用。暂不提供 AAX。
      </p>
    ),
  },
  {
    q: "装在哪里？",
    a: (
      <>
        <p>安装包会自动放到标准位置，装完在宿主里重新扫描插件即可。</p>
        <ul>
          <li>
            Mac VST3：<code>/Library/Audio/Plug-Ins/VST3</code>
          </li>
          <li>
            Mac AU：<code>/Library/Audio/Plug-Ins/Components</code>
          </li>
          <li>
            Windows VST3：<code>C:\Program Files\Common Files\VST3</code>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "mac",
    q: "Mac 提示“无法验证开发者”或插件扫描失败",
    a: (
      <>
        <p>目前的 Mac 版本还没有做苹果公证，第一次使用需要解除一次隔离。打开“终端”，粘贴下面这行后回车，输入开机密码：</p>
        <pre>
          <code>sudo xattr -dr com.apple.quarantine /Library/Audio/Plug-Ins/VST3 /Library/Audio/Plug-Ins/Components</code>
        </pre>
        <p>然后重启宿主、重新扫描插件。</p>
      </>
    ),
  },
  {
    id: "license",
    q: "购买后怎么激活？",
    a: (
      <p>
        付款完成后，下载链接和序列号会发到你结算时填写的邮箱。打开插件，在激活窗口输入序列号即可。授权的具体条款（可激活的电脑数量、换电脑方式）会在正式开卖前写在这里。
      </p>
    ),
  },
  {
    id: "refund",
    q: "可以退款吗？",
    a: <p>插件是数字商品，具体的退款规则会在正式开卖前公布。买之前建议先用免费的 UDG 和试听确认声音是不是你想要的。</p>,
  },
  {
    q: "UDG 和 SPIKE MIX HUB 有什么区别？",
    a: (
      <p>
        UDG 是免费的两旋钮版本，一种性格，适合直接挂在整条伴奏或总线上。SPIKE MIX HUB 是 Pro 版，分 VOCAL、DRUM、MASTER 三个模式，每个模式 7 到 8 个旋钮和 10 个预设，MASTER 里还带着一个 UDG 预设。
      </p>
    ),
  },
  {
    q: "VOCAL 模式录音时感觉有一点延迟",
    a: <p>VOCAL 为了调音有约 17 毫秒延迟。录音时直接监听会感觉稍慢，可以录完再挂，或录音时先关掉。</p>,
  },
];

export default function Support() {
  return (
    <section className="section page-top">
      <div className="wrap narrow">
        <Reveal className="section-head">
          <span className="eyebrow">帮助</span>
          <h1 className="h1">安装与常见问题</h1>
          {site.email && (
            <p className="lead">
              没找到答案？写信到 <a className="link" href={`mailto:${site.email}`}>{site.email}</a>。
            </p>
          )}
        </Reveal>
        <div className="faq">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 40}>
              <details id={f.id} open={i < 1}>
                <summary>{f.q}</summary>
                <div className="faq-a">{f.a}</div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
