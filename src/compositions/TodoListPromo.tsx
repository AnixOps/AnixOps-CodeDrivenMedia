import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  interpolateColors, // 导入正确的颜色插值函数
  spring,
  Easing,
} from 'remotion';

// --- 新增：光标组件，用于模拟用户操作 --- //
const Cursor: React.FC = () => {
    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="#FFFFFF"
            style={{
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
            }}
        >
            <path d="M7.5,2C7.5,2 8.5,2.25 9,3L14.5,13L18.5,11.5C18.5,11.5 19.5,11.25 20,12C20.5,12.75 20,14 20,14L18,16L21.5,19.5C21.5,19.5 22.25,20.5 21.5,21C20.75,21.5 19.5,21.5 19.5,21.5L16,18L14,20C14,20 12.75,20.5 12,20C11.25,19.5 11.5,18.5 11.5,18.5L13,14.5L3,9C3,8.5 2.25,7.5 2,7.5C1.75,7.5 2,8.5 2,8.5L7.5,2Z" />
        </svg>
    );
};

// --- 场景1：痛点呈现 --- //
const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flashOpacity = interpolate(frame, [0, 15, 30], [1, 0.4, 1], {
    extrapolateRight: 'clamp',
  });

  const chaosScale = spring({
    frame,
    fps,
    config: { stiffness: 50, damping: 10 },
  });

    const shakeIntensity = Math.min(frame / (fps * 1.5), 1);
    const shakeX = Math.sin(frame / 4) * 15 * shakeIntensity;
    const shakeY = Math.cos(frame / 6) * 12 * shakeIntensity;
    const hueRotate = interpolate(frame, [0, fps * 6], [0, 45]);
    const gradientShift = interpolate(frame, [0, fps * 6], [0, 100]);

  const calendarColors = useMemo(() => {
    return Array.from({ length: 21 }, () =>
      Math.random() > 0.4 ? '#ff6b6b' : '#f5f5f5'
    );
  }, []);

  return (
    <AbsoluteFill
      style={{
                background: `linear-gradient(135deg, #ff6b6b, #ffa500)`,
                backgroundSize: '160% 160%',
                backgroundPosition: `${gradientShift}% ${gradientShift}%`,
        opacity: flashOpacity,
            transform: `scale(${interpolate(chaosScale, [0, 1], [1.1, 1])}) translate(${shakeX}px, ${shakeY}px)`,
            filter: `hue-rotate(${hueRotate}deg)`,
      }}
    >
            <ParticleField count={28} color="rgba(255, 255, 255, 0.7)" opacity={0.35} blur={25} speed={0.02} amplitude={18} />
      <div style={{ position: 'absolute', top: '15%', left: '10%', transform: 'rotate(-15deg)' }}>
        <div style={{ fontSize: 64, backgroundColor: '#ffeb3b', padding: '25px', boxShadow: '5px 5px 10px rgba(0,0,0,0.2)' }}>
          买菜<br/>开会...
        </div>
      </div>
      <div style={{ position: 'absolute', top: '40%', right: '10%', transform: 'rotate(10deg)' }}>
        <div style={{ fontSize: 56, backgroundColor: '#333', color: 'white', padding: '25px', border: '3px solid #666' }}>
          📧 99+ 未读<br/>📋 15个待办
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: '450px', transform: 'rotate(5deg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', backgroundColor: '#fff', padding: '5px' }}>
          {calendarColors.map((color, i) => (
            <div key={i} style={{ backgroundColor: color, height: '60px' }} />
          ))}
        </div>
      </div>

      <Sequence from={fps * 2.5}>
        <AbsoluteFill style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            fontSize: '240px',
            transform: `scale(${spring({ frame: frame - fps * 2.5, fps })})`,
          }}>
            😵‍💫
          </div>
          <div style={{
            color: '#ffffff',
            fontSize: '56px',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            marginTop: '25px',
            opacity: interpolate(frame, [fps * 3, fps * 3.5], [0, 1]),
          }}>
            任务繁多，杂乱无章？
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// --- 场景2：解决方案介绍 --- //
const Scene2Solution: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoScale = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 120 },
    });

    const textOpacity = (delay: number) => interpolate(
        frame,
        [delay, delay + fps / 2],
        [0, 1],
        { extrapolateRight: 'clamp' }
    );

    const waveMotion = Math.sin(frame / 25) * 20;
    const neonPulse = 0.7 + Math.sin(frame / 12) * 0.3;
    const accentRotation = interpolate(frame, [0, fps * 7], [0, 120]);

    return (
        <AbsoluteFill style={{
            background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2), transparent 45%), linear-gradient(135deg, #4c6ef5, #845ef7)',
            filter: `hue-rotate(${accentRotation}deg)`
        }}>
            <ParticleField count={36} color="rgba(255,255,255,0.45)" opacity={0.3} speed={0.018} amplitude={20} />
            <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '25px' }}>
                <div style={{
                    width: '220px',
                    height: '220px',
                    borderRadius: '30px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '140px',
                    boxShadow: `0 18px 45px rgba(0,0,0,0.35), 0 0 ${30 + neonPulse * 40}px rgba(255, 255, 255, ${0.25 + neonPulse * 0.2})`,
                    transform: `scale(${logoScale * (1 + neonPulse * 0.04)}) translateY(${waveMotion}px)`,
                }}>
                    ✅
                </div>

                <div style={{
                    color: '#ffffff',
                    fontSize: '76px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    opacity: textOpacity(fps * 0.5),
                    transform: `translateY(${interpolate(frame, [fps * 0.5, fps * 1.5], [40, 0], { easing: Easing.out(Easing.cubic) })}px)`
                }}>
                    隆重推出: <strong>TodoList</strong>
                </div>

                <div style={{
                    color: '#e8e8e8',
                    fontSize: '32px',
                    textAlign: 'center',
                    opacity: textOpacity(fps * 1),
                    textShadow: `0 0 ${20 + neonPulse * 10}px rgba(135, 206, 250, 0.6)`,
                }}>
                    让任务管理变得简单高效
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};


// --- 场景3：核心功能演示 (已修复) --- //
const Scene3Features: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const toFrame = (seconds: number) => seconds * fps;

    const themeProgress = spring({ frame: frame - toFrame(3.6), fps, config: { stiffness: 40 } });

    // 使用 interpolateColors 修复颜色动画
    const bgColor = interpolateColors(themeProgress, [0, 1], ['#0f172a', '#f8f9fb']);
    const componentBgColor = interpolateColors(themeProgress, [0, 1], ['#1e293b', '#ffffff']);
    const textColor = interpolateColors(themeProgress, [0, 1], ['#f8fafc', '#1f2937']);
    const mutedTextColor = interpolateColors(themeProgress, [0, 1], ['#94a3b8', '#6b7280']);
    const borderColor = interpolateColors(themeProgress, [0, 1], ['#334155', '#d1d5db']);
    const taskBorderColor = interpolateColors(themeProgress, [0, 1], ['#475569', '#cbd5f5']);

    const cursorTimeline = [
        { time: 0.4, x: 860, y: 780 },
        { time: 1.1, x: 260, y: 160 },
        { time: 2.2, x: 520, y: 320 },
        { time: 3.2, x: 820, y: 640 },
        { time: 4.5, x: 520, y: 520 },
        { time: 5.6, x: 540, y: 300 },
        { time: 6.8, x: 540, y: 430 },
        { time: 8.2, x: 540, y: 430 },
        { time: 9.6, x: 830, y: 120 },
        { time: 10.8, x: 900, y: 80 }
    ];

    const cursorTimes = cursorTimeline.map((step) => toFrame(step.time));
    const cursorX = interpolate(
        frame,
        cursorTimes,
        cursorTimeline.map((step) => step.x),
        { easing: Easing.inOut(Easing.ease), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const cursorY = interpolate(
        frame,
        cursorTimes,
        cursorTimeline.map((step) => step.y),
        { easing: Easing.inOut(Easing.ease), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const modalOpacity = interpolate(
        frame,
        [toFrame(1.0), toFrame(1.3), toFrame(2.1), toFrame(2.4)],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const eventCreated = frame >= toFrame(2.5);
    const task1Added = frame >= toFrame(4.4);
    const task2Added = frame >= toFrame(6.4);
    const task2Completed = frame >= toFrame(8.9);

    const accentGlow = Math.max(0, Math.sin((frame - toFrame(4.2)) / 18)) * 0.55;
    const panelLift = Math.sin(frame / 18) * 5;

    return (
        <AbsoluteFill style={{ backgroundColor: bgColor, color: textColor, transition: 'background-color 0.5s, color 0.5s', overflow: 'hidden' }}>
            <ParticleField count={30} color="rgba(94, 234, 212, 0.35)" opacity={0.25} speed={0.012} amplitude={14} />
            {/* 顶部导航栏 */}
            <header style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '70px',
                backgroundColor: componentBgColor,
                display: 'flex', alignItems: 'center',
                padding: '0 30px',
                borderBottom: `1px solid ${borderColor}`,
                boxShadow: '0 20px 35px rgba(15, 23, 42, 0.25)',
                backdropFilter: 'blur(6px)'
            }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>📋 Todo List</div>
                <div style={{ marginLeft: '15px', padding: '5px 12px', background: 'linear-gradient(135deg, #38bdf8, #6366f1)', color: '#fff', borderRadius: '999px', fontSize: '13px', boxShadow: '0 0 15px rgba(99,102,241,0.45)' }}>Offline Mode</div>
                <div style={{ flexGrow: 1 }} />
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button style={{ background: 'none', border: '1px solid #888', color: 'inherit', padding: '8px 12px', borderRadius: '8px' }}>🌐 English</button>
                    <button style={{ background: 'none', border: '1px solid #888', color: 'inherit', padding: '8px', borderRadius: '8px' }}>
                        {frame > toFrame(6.8) ? '☀️' : '🌙'}
                    </button>
                    <button style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px' }}>Export Data</button>
                    <button style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px' }}>Import Data</button>
                    <button style={{ backgroundColor: '#0dcaf0', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px' }}>Login</button>
                </div>
            </header>

            {/* 主体内容区 */}
            <main style={{ display: 'flex', paddingTop: '70px', height: '100%', backdropFilter: 'blur(4px)' }}>
                {/* 左侧事件列表 */}
                <div style={{
                    width: '30%', borderRight: `1px solid ${borderColor}`,
                    padding: '20px',
                    transform: `translateY(${panelLift}px)`,
                    transition: 'transform 0.4s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '28px' }}>My Events</h2>
                        <button style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '16px' }}>+ Create Event</button>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        {eventCreated ? (
                             <div style={{ padding: '18px', background: 'linear-gradient(145deg, rgba(59,130,246,0.15), transparent)', borderRadius: '12px', border: `1px solid ${borderColor}`, boxShadow: '0 15px 30px rgba(96, 165, 250, 0.25)' }}>Project Phoenix</div>
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: '100px', color: mutedTextColor }}>
                                <div style={{ fontSize: '80px' }}>📄</div>
                                <h3>No events yet</h3>
                                <p>Create your first event to start managing tasks!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧任务列表 */}
                <div style={{ width: '70%', padding: '20px', position: 'relative', transform: `translateY(${panelLift * -1}px)`, transition: 'transform 0.4s ease' }}>
                    {!eventCreated ? (
                        <div style={{ textAlign: 'center', marginTop: '100px', color: mutedTextColor }}>
                            <div style={{ fontSize: '80px' }}>📋</div>
                            <h3>Select an Event</h3>
                            <p>Click on an event on the left to view and manage tasks</p>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ fontSize: '36px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                Project Phoenix
                                <span style={{ fontSize: '16px', color: '#38bdf8', letterSpacing: '0.3em', textTransform: 'uppercase' }}>LIVE</span>
                            </h2>
                            <div style={{ marginTop: '20px', fontSize: '18px' }}>
                                {task1Added && <div style={{padding: '14px', border: `1px solid ${taskBorderColor}`, borderRadius: '12px', marginBottom: '12px', boxShadow: accentGlow > 0.1 ? `0 0 ${25 + accentGlow * 35}px rgba(56, 189, 248, 0.35)` : undefined, background: 'rgba(15, 23, 42, 0.05)' }}>
                                    ⚪️ Design new logo
                                </div>}
                                {task2Added && <div style={{padding: '14px', border: `1px solid ${taskBorderColor}`, borderRadius: '12px', marginBottom: '12px',
                                    textDecoration: task2Completed ? 'line-through' : 'none', color: task2Completed ? mutedTextColor : textColor,
                                    boxShadow: task2Completed ? `0 0 ${20 + accentGlow * 30}px rgba(74, 222, 128, 0.3)` : `0 0 ${18 + accentGlow * 24}px rgba(129, 140, 248, 0.25)`,
                                    background: task2Completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99,102,241,0.08)'}}>
                                    {task2Completed ? '✅' : '⚪️'} Develop homepage
                                </div>}
                            </div>
                            <input type="text" placeholder="Enter a new task..." readOnly style={{
                                position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                                backgroundColor: componentBgColor, color: textColor,
                                border: `1px solid ${taskBorderColor}`,
                                padding: '16px', borderRadius: '12px', fontSize: '16px',
                                boxShadow: `0 0 ${18 + accentGlow * 22}px rgba(129, 140, 248, 0.25)`
                            }}/>
                        </div>
                    )}
                </div>
            </main>

            {/* 创建事件 Modal */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: modalOpacity
            }}>
                <div style={{ backgroundColor: componentBgColor, padding: '30px', borderRadius: '12px', width: '400px' }}>
                    <h3 style={{ fontSize: '24px', marginTop: 0 }}>Create New Event</h3>
                    <input type="text" value="Project Phoenix" readOnly style={{ width: '100%', padding: '10px', fontSize: '16px', marginTop: '10px' }} />
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '16px', marginRight: '10px' }}>Cancel</button>
                        <button style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '16px' }}>Create</button>
                    </div>
                </div>
            </div>

            {/* 模拟光标 */}
            <div style={{ position: 'absolute', left: cursorX, top: cursorY, transform: 'translate(-5px, -5px)', opacity: interpolate(frame, [0, fps], [0, 1]) }}>
                <Cursor />
            </div>
        </AbsoluteFill>
    );
};


// --- 场景4：跨平台与高级特性 --- //
const Scene4CrossPlatform: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const deviceAnimation = (delay: number) => spring({
        frame: frame - delay,
        fps,
        config: { stiffness: 120, damping: 12, mass: 1.4 },
    });

    const getDeviceStyle = (delay: number, rotation: number, glowColor: string, scale: number): React.CSSProperties => {
        const progress = deviceAnimation(delay);
        const float = interpolate(progress, [0, 1], [30, -30]);
        const tilt = Math.sin((frame + delay) / 30) * rotation;
        const pulse = 0.4 + Math.sin((frame + delay) / 18) * 0.3;

        return {
            position: 'absolute',
            background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.35), rgba(59, 130, 246, 0.6))',
            border: '4px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${float}px) rotate(${tilt}deg) scale(${scale})`,
            boxShadow: `0 35px 55px rgba(3, 7, 18, 0.4), 0 0 ${65 + pulse * 60}px ${glowColor}`,
            backdropFilter: 'blur(6px)',
        };
    };

    const hueShift = interpolate(frame, [0, fps * 7], [0, 90]);

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #0ea5e9, #312e81)',
            filter: `hue-rotate(${hueShift}deg)`
        }}>
            <ParticleField count={34} color="rgba(165, 243, 252, 0.5)" opacity={0.3} speed={0.02} amplitude={22} />
            <div style={{ ...getDeviceStyle(0, 4, 'rgba(165, 243, 252, 0.35)', 1.05), left: '16%', top: '35%', width: '360px', height: '220px', borderRadius: '18px', fontSize: '80px' }}>🖥️</div>
            <div style={{ ...getDeviceStyle(24, 8, 'rgba(134, 239, 172, 0.35)', 1), left: '44%', top: '42%', width: '240px', height: '300px', borderRadius: '28px', fontSize: '72px' }}>📟</div>
            <div style={{ ...getDeviceStyle(48, 12, 'rgba(248, 250, 252, 0.4)', 0.95), left: '72%', top: '30%', width: '160px', height: '310px', borderRadius: '36px', fontSize: '66px' }}>📱</div>

            <Sequence from={fps * 2.2}>
                <div style={{ position: 'absolute', left: '22%', top: '20%', backgroundColor: 'rgba(255,255,255,0.9)', padding: '18px 28px', borderRadius: '18px', fontSize: '26px', color: '#0f172a', boxShadow: '0 18px 40px rgba(2, 6, 23, 0.25)', transform: `translateY(${Math.sin(frame / 12) * 6}px)` }}>
                    📲 一键安装 PWA
                </div>
            </Sequence>
            <Sequence from={fps * 3.4}>
                <div style={{ position: 'absolute', right: '12%', top: '22%', backgroundColor: 'rgba(74, 222, 128, 0.95)', color: '#022c22', padding: '18px 28px', borderRadius: '18px', fontSize: '26px', boxShadow: '0 18px 40px rgba(22, 101, 52, 0.35)', transform: `translateY(${Math.cos(frame / 14) * 6}px)` }}>
                    🌐 离线无缝工作
                </div>
            </Sequence>

            <div style={{
                position: 'absolute',
                bottom: '9%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#ffffff',
                fontSize: '32px',
                textAlign: 'center',
                maxWidth: '900px',
                lineHeight: '1.6',
                opacity: interpolate(frame, [fps * 0.8, fps * 1.6], [0, 1]),
                textShadow: '0 8px 24px rgba(15, 23, 42, 0.55)'
            }}>
                全端体验，极速响应，PWA 与离线能力全面开启。
                <br />
                无论电脑、平板还是手机，TodoList 都能与你无缝协作。
            </div>
        </AbsoluteFill>
    );
};

// --- 场景5：品牌展示 --- //
const Scene5Brand: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoScale = spring({
        frame,
        fps,
        config: { damping: 10, stiffness: 100 },
    });
    
    const textOpacity = (delay: number) => interpolate(frame, [delay, delay + 30], [0, 1]);
    const haloPulse = 0.85 + Math.sin(frame / 18) * 0.25;
    const glowShift = interpolate(frame, [0, fps * 6], [0, 120]);

    return (
        <AbsoluteFill style={{ background: 'linear-gradient(160deg, #1e293b, #0f172a 40%, #1e293b)' }}>
            <ParticleField count={40} color="rgba(99, 102, 241, 0.5)" opacity={0.28} speed={0.016} amplitude={16} />
            <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '50px' }}>
                <div style={{
                    transform: `scale(${logoScale * haloPulse})`,
                    padding: '35px 70px',
                    backgroundColor: '#fff',
                    borderRadius: '25px',
                    fontSize: '56px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    boxShadow: `0 25px 55px rgba(15, 23, 42, 0.45), 0 0 ${50 + haloPulse * 60}px rgba(56, 189, 248, 0.35)`,
                    letterSpacing: '0.08em'
                }}>
                    AnixOps Studio
                </div>

                <div style={{ display: 'flex', gap: '60px', fontSize: '36px', fontWeight: 'bold' }}>
                    <div style={{ color: '#38bdf8', opacity: textOpacity(fps * 2), textShadow: `0 0 ${20 + haloPulse * 12}px rgba(56,189,248,0.6)` }}>创新</div>
                    <div style={{ color: '#f87171', opacity: textOpacity(fps * 3), textShadow: `0 0 ${20 + haloPulse * 12}px rgba(248,113,113,0.6)` }}>质量</div>
                    <div style={{ color: '#4ade80', opacity: textOpacity(fps * 4), textShadow: `0 0 ${20 + haloPulse * 12}px rgba(74,222,128,0.6)` }}>卓越</div>
                </div>

                <div style={{
                    color: '#ffffff',
                    fontSize: '28px',
                    textAlign: 'center',
                    maxWidth: '800px',
                    lineHeight: '1.7',
                    opacity: textOpacity(fps * 1),
                    textShadow: `0 8px 40px rgba(15, 23, 42, 0.55)`
                }}>
                    由 AnixOps Studio 精心打造，我们致力于用创新技术，为您创造无限可能。
                </div>
            </AbsoluteFill>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(56,189,248,0.25), transparent 50%)', mixBlendMode: 'screen', filter: `hue-rotate(${glowShift}deg)` }} />
        </AbsoluteFill>
    );
};

// --- 场景6：行动号召 (CTA) --- //
const Scene6CTA: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const pulseScale = 1 + spring({
        frame: frame - fps * 2,
        fps,
        config: { damping: 1, stiffness: 10, mass: 0.1 },
    }) * 0.05;

    const urlText = 'todo.anixops.com/todo';
    const typewriterProgress = interpolate(frame, [fps, fps * 4], [0, urlText.length], { extrapolateRight: 'clamp' });
    const displayText = urlText.slice(0, Math.round(typewriterProgress));

    const gradientWave = interpolate(frame, [0, fps * 6], [0, 160]);
    const shimmer = Math.sin(frame / 10) * 8;
    const accentGlow = 0.5 + Math.sin(frame / 12) * 0.4;

    return (
        <AbsoluteFill style={{
            background: `linear-gradient(135deg, #6366f1, #7c3aed)`
        }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 20% 30%, rgba(196,181,253,0.35), transparent 50%), radial-gradient(circle at 80% 70%, rgba(129,140,248,0.4), transparent 55%)`, transform: `translateY(${shimmer}px)` }} />
            <ParticleField count={48} color="rgba(255,255,255,0.55)" opacity={0.32} speed={0.022} amplitude={24} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.12), transparent 60%)', mixBlendMode: 'screen', filter: `hue-rotate(${gradientWave}deg)` }} />
            <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '35px' }}>
                <div style={{ fontSize: '36px', color: '#fff', opacity: interpolate(frame, [0, fps], [0, 1]), textAlign: 'center' }}>
                    由 <strong>AnixOps Studio</strong> 精心打造，立即开启高效的极简任务管理之旅
                </div>

                <a href="https://todo.anixops.com/todo" target="_blank" rel="noopener noreferrer" style={{
                    fontSize: '32px',
                    color: '#ffffff',
                    backgroundColor: '#3498db',
                    padding: '22px 45px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    boxShadow: `0 18px 45px rgba(15, 23, 42, 0.45), 0 0 ${30 + accentGlow * 40}px rgba(96, 165, 250, 0.65)`,
                    textDecoration: 'none',
                    transform: `scale(${pulseScale})`,
                    letterSpacing: '0.08em'
                }}>
                    立即访问
                </a>

                <div style={{
                    fontFamily: 'monospace',
                    fontSize: '28px',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.35)',
                }}>
                    {displayText}
                    <span style={{ animation: `blink 1s step-end infinite` }}>|</span>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '6.5%',
                    color: '#ffffff',
                    fontSize: '30px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    lineHeight: 1.5,
                    opacity: interpolate(frame, [fps*5, fps*6], [0, 1]),
                    textShadow: '0 12px 32px rgba(30, 64, 175, 0.55)'
                }}>
                    TodoList · https://todo.anixops.com/todo
                    <br />
                    AnixOps Studio — 与您并肩打造智能工作流 ✅
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};


// --- 主组件 --- //
export const TodoListPromo: React.FC = () => {
    const { fps } = useVideoConfig();

    const secondsToFrames = (seconds: number) => Math.round(seconds * fps);

    const scene1Start = 0;
        const scene1Duration = secondsToFrames(6);

    const scene2Start = scene1Start + scene1Duration;
        const scene2Duration = secondsToFrames(7);

    const scene3Start = scene2Start + scene2Duration;
        const scene3Duration = secondsToFrames(12);

    const scene4Start = scene3Start + scene3Duration;
        const scene4Duration = secondsToFrames(7);

    const scene5Start = scene4Start + scene4Duration;
        const scene5Duration = secondsToFrames(6);

    const scene6Start = scene5Start + scene5Duration;
        const scene6Duration = secondsToFrames(7);

  return (
    <>
      <Sequence from={scene1Start} durationInFrames={scene1Duration}>
        <Scene1Problem />
      </Sequence>
      
      <Sequence from={scene2Start} durationInFrames={scene2Duration}>
        <Scene2Solution />
      </Sequence>
      
      <Sequence from={scene3Start} durationInFrames={scene3Duration}>
        <Scene3Features />
      </Sequence>
      
      <Sequence from={scene4Start} durationInFrames={scene4Duration}>
        <Scene4CrossPlatform />
      </Sequence>
      
      <Sequence from={scene5Start} durationInFrames={scene5Duration}>
        <Scene5Brand />
      </Sequence>
      
      <Sequence from={scene6Start} durationInFrames={scene6Duration}>
        <Scene6CTA />
      </Sequence>
      
      <style>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

type Particle = {
    x: number;
    y: number;
    size: number;
    drift: number;
    speed: number;
};

const ParticleField: React.FC<{
    count?: number;
    color?: string;
    opacity?: number;
    blur?: number;
    speed?: number;
    amplitude?: number;
}> = ({
    count = 32,
    color = 'rgba(82, 196, 255, 0.8)',
    opacity = 0.6,
    blur = 30,
    speed = 0.015,
    amplitude = 12,
}) => {
    const frame = useCurrentFrame();

    const particles = useMemo<Particle[]>(() => {
        return Array.from({ length: count }, () => ({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 45 + 15,
            drift: Math.random() * 1000,
            speed: (Math.random() + 0.3) * speed,
        }));
    }, [count, speed]);

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
            {particles.map((particle, index) => {
                const xOffset = Math.sin((frame + particle.drift) * particle.speed) * amplitude;
                const yOffset = Math.cos((frame + particle.drift) * particle.speed) * amplitude * 0.8;
                const scale = 0.9 + Math.sin((frame + particle.drift) * particle.speed * 2) * 0.25;

                return (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: `${particle.x * 100}%`,
                            top: `${particle.y * 100}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            background: color,
                            borderRadius: '50%',
                            opacity,
                              filter: `blur(${blur}px)`,
                            transform: `translate(-50%, -50%) translate(${xOffset}px, ${yOffset}px) scale(${scale})`,
                            mixBlendMode: 'screen',
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};