import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
	ArrowUpRight,
	ChevronLeft,
	ChevronRight,
	Download,
} from 'lucide-react';
import { useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const shots = [
	{ src: '/app-home.webp', alt: 'Otoha 首页' },
	{ src: '/app-lyrics.webp', alt: 'Otoha 歌词页' },
	{ src: '/app-explore.webp', alt: 'Otoha 探索' },
	{ src: '/app-library.webp', alt: 'Otoha 媒体库' },
	{ src: '/app-history.webp', alt: 'Otoha 历史记录' },
	{ src: '/app-downloads.webp', alt: 'Otoha 下载' },
	{ src: '/app-playlists.webp', alt: 'Otoha 播放列表' },
];

// Slightly oversized so the container's rounded corners clip the image's thin edge
const REST_SCALE = 1.04;

function settle(items: HTMLImageElement[], active: number) {
	items.forEach((item, i) => {
		gsap.set(item, {
			opacity: i === active ? 1 : 0,
			filter: 'blur(0px)',
			scale: REST_SCALE,
		});
	});
}

export function Home() {
	const scope = useRef<HTMLDivElement>(null);
	const slides = useRef<HTMLDivElement>(null);
	const active = useRef(0);
	const transition = useRef<gsap.core.Timeline | null>(null);
	const [index, setIndex] = useState(0);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();

			mm.add('(prefers-reduced-motion: no-preference)', () => {
				gsap.from('[data-hero]', {
					y: 24,
					opacity: 0,
					duration: 0.8,
					stagger: 0.12,
					ease: 'power3.out',
				});

				gsap.from('[data-stage]', {
					y: 60,
					opacity: 0,
					duration: 1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: '[data-stage]',
						start: 'top 85%',
						once: true,
					},
				});
			});

			const items = Array.from(
				scope.current?.querySelectorAll<HTMLImageElement>('[data-slide]') ?? []
			);

			settle(items, 0);
		},
		{ scope }
	);

	function go(next: number) {
		const target = (next + shots.length) % shots.length;
		const current = active.current;
		const items = Array.from(
			slides.current?.querySelectorAll<HTMLImageElement>('[data-slide]') ?? []
		);

		if (!items.length || target === current) {
			return;
		}

		// Interrupted transitions can leave slides mid-tween, so stop them and reset every slide first
		transition.current?.kill();
		settle(items, current);

		active.current = target;
		setIndex(target);

		const tl = gsap.timeline({
			onComplete: () => settle(items, target),
		});

		tl.to(
			items[current],
			{
				opacity: 0,
				filter: 'blur(6px)',
				scale: REST_SCALE * 1.02,
				duration: 0.25,
				ease: 'power2.in',
			},
			0
		).fromTo(
			items[target],
			{ opacity: 0, filter: 'blur(6px)', scale: REST_SCALE * 0.98 },
			{
				opacity: 1,
				filter: 'blur(0px)',
				scale: REST_SCALE,
				duration: 0.35,
				ease: 'power2.out',
			},
			0
		);

		transition.current = tl;
	}

	return (
		<div className="py-20" ref={scope}>
			{/* Hero: left-aligned column, like the reference */}
			<section className="mx-auto max-w-5xl px-6">
				<img
					alt=""
					className="size-28 rounded-[1.75rem]"
					data-hero
					src="/otoha-icon.png"
				/>
				<h1 className="mt-8 text-5xl font-semibold tracking-tight" data-hero>
					Otoha
				</h1>
				<p className="mt-4 text-xl text-[#A3A59C]" data-hero>
					原生 YouTube Music 桌面播放器。
				</p>
				<p className="mt-4 max-w-xl leading-relaxed text-[#5f6259]" data-hero>
					基于 Flutter 构建，支持同步歌词、离线媒体包与本地播放列表。
				</p>

				<div className="mt-10 flex flex-wrap gap-3" data-hero>
					<a
						className="flex items-center gap-2 rounded-full bg-[#B6F26D] py-2.5
							pr-3 pl-6 font-semibold text-[#1A210F] transition-transform
							hover:scale-[1.02]"
						href="https://github.com/1Yie/otoha/releases"
						rel="noreferrer"
						target="_blank"
					>
						下载最新版
						<span
							className="flex size-7 items-center justify-center rounded-full
								bg-[#1A210F]/10"
						>
							<Download className="size-4" />
						</span>
					</a>
					<a
						className="flex items-center gap-2 rounded-full bg-white/10 px-6
							py-2.5 font-semibold text-[#F1F2EC] transition-colors
							hover:bg-white/15"
						href="https://github.com/1Yie/otoha#run-from-source"
						rel="noreferrer"
						target="_blank"
					>
						从源码运行
						<ArrowUpRight className="size-4" />
					</a>
				</div>
			</section>

			{/* Stage: gradient panel with framed screenshots and carousel */}
			<section className="mx-auto mt-20 max-w-5xl px-6" data-stage>
				<div
					className="relative overflow-hidden rounded-3xl bg-gradient-to-br
						from-[#2a3320] via-[#171816] to-[#111210] px-20 py-10 md:px-24
						md:py-14"
				>
					<div
						className="relative aspect-[1780/1100] overflow-hidden rounded-lg"
					>
						<div className="grid size-full" ref={slides}>
							{shots.map((shot) => (
								<img
									alt={shot.alt}
									className="size-full object-cover [grid-area:1/1]"
									data-slide
									key={shot.src}
									src={shot.src}
								/>
							))}
						</div>
					</div>

					<button
						aria-label="上一张"
						className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2
							items-center justify-center rounded-full bg-[#111210]/70
							text-[#F1F2EC] transition-colors hover:bg-[#111210]"
						onClick={() => go(index - 1)}
						type="button"
					>
						<ChevronLeft className="size-5" />
					</button>
					<button
						aria-label="下一张"
						className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2
							items-center justify-center rounded-full bg-[#111210]/70
							text-[#F1F2EC] transition-colors hover:bg-[#111210]"
						onClick={() => go(index + 1)}
						type="button"
					>
						<ChevronRight className="size-5" />
					</button>

					<div className="mt-8 flex justify-center gap-2">
						{shots.map((shot, i) => (
							<button
								aria-label={`切换到 ${shot.alt}`}
								className={`h-2 rounded-full transition-all ${
									i === index ? 'w-6 bg-[#B6F26D]' : 'w-2 bg-white/25'
								}`}
								key={shot.src}
								onClick={() => go(i)}
								type="button"
							/>
						))}
					</div>
				</div>

				<p className="mt-8 text-center text-xs text-[#5f6259]">
					Otoha 是非官方客户端，与 YouTube 或 Google 无关。
				</p>

				<a
					className="mt-6 flex items-center justify-center gap-2 text-xs
						text-[#5f6259] transition-colors hover:text-[#A3A59C]"
					href="https://ingstar.im"
					rel="noreferrer"
					target="_blank"
				>
					Powered by ingStar
					<img alt="" className="size-4" src="/ingstar-icon.png" />
				</a>
			</section>
		</div>
	);
}
