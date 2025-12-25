import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../../config";

const storageKey = "tawjihi_ai_chat_history";

const baseStyles = {
	wrapper: {
		position: "fixed",
		bottom: "16px",
		right: "16px",
		zIndex: 1200,
		fontFamily: "inherit",
	},
	button: {
		borderRadius: "999px",
		padding: "12px 16px",
		border: "none",
		background: "#0d6efd",
		color: "#fff",
		boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
		cursor: "pointer",
	},
	panel: {
		width: "360px",
		maxHeight: "560px",
		background: "#fff",
		borderRadius: "12px",
		boxShadow: "0 10px 28px rgba(0,0,0,0.15)",
		display: "flex",
		flexDirection: "column",
		overflow: "hidden",
	},
	header: {
		padding: "12px 14px",
		background: "#0d6efd",
		color: "#fff",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	body: {
		flex: 1,
		padding: "10px",
		overflowY: "auto",
		background: "#f8f9fa",
	},
	footer: {
		padding: "10px",
		borderTop: "1px solid #e9ecef",
		display: "flex",
		gap: "8px",
	},
	msg: {
		user: { alignSelf: "flex-end", background: "#0d6efd", color: "#fff" },
		ai: { alignSelf: "flex-start", background: "#fff", color: "#1f2d3d", border: "1px solid #e9ecef" },
	},
	citation: {
		background: "#eef2ff",
		border: "1px solid #d7dbff",
		borderRadius: "6px",
		padding: "6px 8px",
		fontSize: "12px",
		marginTop: "6px",
	},
};

const loadHistory = () => {
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return [];
		return JSON.parse(raw);
	} catch (e) {
		return [];
	}
};

const saveHistory = (data) => {
	try {
		localStorage.setItem(storageKey, JSON.stringify(data));
	} catch (e) {
		// ignore
	}
};

const AiChatWidget = () => {
	const [open, setOpen] = useState(false);
	const [history, setHistory] = useState(() => loadHistory());
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		saveHistory(history);
	}, [history]);

	const toggle = () => setOpen((v) => !v);

	const onSend = async () => {
		const trimmed = message.trim();
		if (!trimmed) return;
		setError("");
		const newHistory = [...history, { role: "user", text: trimmed }];
		setHistory(newHistory);
		setMessage("");
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/ai/chat`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ message: trimmed }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Chat failed");
			const aiText = data.inScope
				? data.answer || "No answer returned."
				: "لا يوجد محتوى كافٍ في دروسك للإجابة. inScope=false";
			setHistory((h) => [
				...h,
				{
					role: "ai",
					text: aiText,
					citations: data.citations || [],
				},
			]);
		} catch (err) {
			setError(err.message || "Chat failed");
			setHistory((h) => [...h, { role: "ai", text: "تعذر الحصول على إجابة الآن." }]);
		} finally {
			setLoading(false);
		}
	};

	const isStudent = useMemo(() => {
		const raw = localStorage.getItem("user");
		if (!raw) return false;
		try {
			const parsed = JSON.parse(raw);
			return parsed?.role === "user";
		} catch (e) {
			return false;
		}
	}, []);

	if (!isStudent) return null;

	return (
		<div style={baseStyles.wrapper}>
			{open ? (
				<div style={baseStyles.panel}>
					<div style={baseStyles.header}>
						<span>AI Study Helper</span>
						<button
							onClick={toggle}
							style={{ background: "transparent", color: "#fff", border: "none", cursor: "pointer" }}
						>
							✕
						</button>
					</div>
					<div style={baseStyles.body}>
						{history.length === 0 && (
							<div style={{ fontSize: "14px", color: "#6c757d" }}>
								اسأل عن دروسك. كل إجابة ستتضمن مراجع من دروسك المسجلة.
							</div>
						)}
						{history.map((msg, idx) => (
							<div
								key={idx}
								style={{
									marginBottom: "10px",
									display: "flex",
									justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
								}}
							>
								<div
									style={{
										maxWidth: "80%",
										padding: "10px 12px",
										borderRadius: "12px",
										...baseStyles.msg[msg.role === "user" ? "user" : "ai"],
									}}
								>
									<div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
									{msg.citations && msg.citations.length > 0 && (
										<div style={baseStyles.citation}>
											<strong>References:</strong>
											<ul style={{ paddingLeft: "18px", margin: "4px 0" }}>
												{msg.citations.map((c, cidx) => (
													<li key={cidx} style={{ marginBottom: "2px" }}>
														{c.lessonTitle || "Lesson"} · {c.courseTitle || "Course"}
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						))}
						{error && <div style={{ color: "#d6336c", fontSize: "13px" }}>{error}</div>}
					</div>
					<div style={baseStyles.footer}>
						<input
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="اسأل عن درس..."
							style={{
								flex: 1,
								border: "1px solid #ced4da",
								borderRadius: "8px",
								padding: "10px",
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									onSend();
								}
							}}
						/>
						<button
							onClick={onSend}
							disabled={loading}
							style={{
								background: loading ? "#adb5bd" : "#0d6efd",
								color: "#fff",
								border: "none",
								borderRadius: "8px",
								padding: "0 14px",
								minWidth: "70px",
								cursor: loading ? "not-allowed" : "pointer",
							}}
						>
							{loading ? "..." : "Send"}
						</button>
					</div>
				</div>
			) : (
				<button style={baseStyles.button} onClick={toggle}>
					💬 AI Study Helper
				</button>
			)}
		</div>
	);
};

export default AiChatWidget;
