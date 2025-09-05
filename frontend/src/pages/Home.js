import React from 'react';

import { useNavigate } from 'react-router-dom';

const Home = () => {
	const navigate = useNavigate();
	return (
		<div style={{
			minHeight: '100vh',
			background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 0
		}}>
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				maxWidth: 1200,
				margin: '0 auto',
				padding: '48px 0 32px 0',
				gap: 48
			}}>
				{/* Left: Hero Text */}
				<div style={{ flex: 1, minWidth: 340 }}>
					<h1 style={{ fontSize: '3rem', color: '#1976d2', fontWeight: 800, marginBottom: 18 }}>
						Connect, Grow, and Succeed
					</h1>
					<p style={{ fontSize: '1.3rem', color: '#444', marginBottom: 32, maxWidth: 420 }}>
						Join your alumni network for mentorship, jobs, and events. <br />
						Unlock opportunities and build your professional journey—just like LinkedIn, but for your campus!
					</p>
					<button
						className="btn-primary"
						style={{ fontSize: '1.2rem', padding: '14px 36px', fontWeight: 600 }}
						onClick={() => navigate('/login')}
					>
						Get Started
					</button>
				</div>
				{/* Right: Illustration */}
				<div style={{ flex: 1, minWidth: 340, display: 'flex', justifyContent: 'center' }}>
					<img
						src="https://cdn.pixabay.com/photo/2017/01/31/13/14/social-2022597_1280.png"
						alt="Alumni Network"
						style={{ width: 340, maxWidth: '100%', borderRadius: 24, boxShadow: '0 8px 32px rgba(25,118,210,0.10)' }}
					/>
				</div>
			</div>
			{/* Features Section */}
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				gap: 32,
				justifyContent: 'center',
				marginTop: 24,
				marginBottom: 32,
				flexWrap: 'wrap',
				width: '100%',
				maxWidth: 1100
			}}>
				<div className="card" style={{ flex: '1 1 260px', minWidth: 260, textAlign: 'center' }}>
					<img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Mentorship" style={{ width: 56, marginBottom: 12 }} />
					<h3>Mentorship</h3>
					<p>Connect with experienced alumni for one-on-one guidance and career advice.</p>
				</div>
				<div className="card" style={{ flex: '1 1 260px', minWidth: 260, textAlign: 'center' }}>
					<img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="Job Referrals" style={{ width: 56, marginBottom: 12 }} />
					<h3>Job Referrals</h3>
					<p>Get referred to top companies and track your application status easily.</p>
				</div>
				<div className="card" style={{ flex: '1 1 260px', minWidth: 260, textAlign: 'center' }}>
					<img src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png" alt="Events" style={{ width: 56, marginBottom: 12 }} />
					<h3>Events & Webinars</h3>
					<p>Participate in exclusive webinars, Q&A sessions, and networking events.</p>
				</div>
			</div>
		</div>
	);
};
export default Home;
