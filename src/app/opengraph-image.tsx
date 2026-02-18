import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Thinkery Café — A Calm Café Space in Calicut, Kerala';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    backgroundColor: '#2C3318',
                    fontFamily: 'Georgia, serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Left decorative stripe */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '6px',
                        backgroundColor: '#C9A84C',
                    }}
                />

                {/* Background subtle grid */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Ambient glow top-right */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
                    }}
                />

                {/* Ambient glow bottom-left */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-80px',
                        left: '200px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(84,96,50,0.4) 0%, transparent 70%)',
                    }}
                />

                {/* Main content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '64px 80px',
                        flex: 1,
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    {/* Top: Logo area */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#C9A84C',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                            }}
                        >
                            ☕
                        </div>
                        <span
                            style={{
                                color: '#C9A84C',
                                fontSize: '14px',
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                fontFamily: 'Georgia, serif',
                            }}
                        >
                            Est. 2026 · Calicut, Kerala
                        </span>
                    </div>

                    {/* Middle: Main headline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div
                            style={{
                                fontSize: '96px',
                                fontWeight: '600',
                                color: '#F5F0E8',
                                lineHeight: '0.9',
                                letterSpacing: '-2px',
                                fontFamily: 'Georgia, serif',
                            }}
                        >
                            Thinkery
                        </div>
                        <div
                            style={{
                                fontSize: '52px',
                                fontWeight: '400',
                                color: '#C9A84C',
                                fontStyle: 'italic',
                                fontFamily: 'Georgia, serif',
                                lineHeight: '1',
                            }}
                        >
                            Café
                        </div>

                        {/* Gold divider */}
                        <div
                            style={{
                                width: '80px',
                                height: '2px',
                                backgroundColor: '#C9A84C',
                                marginTop: '16px',
                                marginBottom: '8px',
                            }}
                        />

                        <div
                            style={{
                                fontSize: '24px',
                                color: '#A8B890',
                                fontFamily: 'Georgia, serif',
                                fontWeight: '400',
                                letterSpacing: '0.02em',
                            }}
                        >
                            A Calm Space for Work &amp; Conversation
                        </div>
                        <div
                            style={{
                                fontSize: '18px',
                                color: '#6B7A52',
                                fontFamily: 'Georgia, serif',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Calicut · Kerala · India
                        </div>
                    </div>

                    {/* Bottom: URL + tagline */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '16px',
                                color: '#546032',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                            }}
                        >
                            thinkerycafe.in
                        </div>

                        {/* Feature pills */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {['WiFi', 'Power', 'Quiet'].map((tag) => (
                                <div
                                    key={tag}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '100px',
                                        border: '1px solid rgba(201,168,76,0.3)',
                                        color: '#C9A84C',
                                        fontSize: '13px',
                                        letterSpacing: '0.1em',
                                        backgroundColor: 'rgba(201,168,76,0.08)',
                                    }}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right decorative panel */}
                <div
                    style={{
                        width: '280px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderLeft: '1px solid rgba(255,255,255,0.06)',
                        padding: '40px 32px',
                        gap: '32px',
                        backgroundColor: 'rgba(0,0,0,0.15)',
                    }}
                >
                    {/* Decorative coffee cup */}
                    <div
                        style={{
                            fontSize: '80px',
                            lineHeight: '1',
                        }}
                    >
                        ☕
                    </div>

                    {/* Stats */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            width: '100%',
                        }}
                    >
                        {[
                            { value: '50+', label: 'Menu Items' },
                            { value: '7', label: 'Days Open' },
                            { value: '4hr+', label: 'Avg Stay' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '28px',
                                        fontWeight: '600',
                                        color: '#F5F0E8',
                                        fontFamily: 'Georgia, serif',
                                    }}
                                >
                                    {stat.value}
                                </span>
                                <span
                                    style={{
                                        fontSize: '11px',
                                        color: '#6B7A52',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        marginTop: '4px',
                                    }}
                                >
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
