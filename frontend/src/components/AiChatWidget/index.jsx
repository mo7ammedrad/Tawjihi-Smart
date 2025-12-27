import { useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "../../config";

const storageKeyBase = "tawjihi_ai_chat_history";
const welcomeMsg = "مرحباً! أنا مساعد الدراسة الخاص بك. كيف أقدر أساعدك؟";

const getUserInfo = () => {
	try {
		const raw = localStorage.getItem("user");
		if (!raw) return { userId: null, role: null };
		const parsed = JSON.parse(raw);
		return { userId: parsed?._id || parsed?.id || null, role: parsed?.role || null };
	} catch (e) {
		return { userId: null, role: null };
	}
};

const baseStyles = {
	wrapper: {
		position: "fixed",
		bottom: "18px",
		right: "18px",
		zIndex: 1200,
		fontFamily: "'Cairo', 'Noto Sans Arabic', 'Inter', sans-serif",
	},
	button: {
		borderRadius: "999px",
		padding: "13px 18px",
		border: "none",
		background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
		color: "#fff",
		boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
		cursor: "pointer",
		fontWeight: 700,
		letterSpacing: "0.3px",
	},
	panel: {
		width: "400px",
		maxHeight: "620px",
		background: "#0b1220",
		borderRadius: "18px",
		boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
		display: "flex",
		flexDirection: "column",
		overflow: "hidden",
		border: "1px solid rgba(255,255,255,0.08)",
	},
	header: {
		padding: "14px 16px",
		background: "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(79,70,229,0.25))",
		color: "#e2e8f0",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		backdropFilter: "blur(12px)",
		borderBottom: "1px solid rgba(255,255,255,0.08)",
	},
	headerTitle: {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		fontWeight: 700,
	},
	headerIcon: {
		width: "36px",
		height: "36px",
		borderRadius: "12px",
		background: "linear-gradient(135deg, rgba(14,165,233,0.5), rgba(79,70,229,0.5))",
		display: "grid",
		placeItems: "center",
		color: "#fff",
		fontWeight: 800,
		fontSize: "16px",
		boxShadow: "0 10px 26px rgba(14,165,233,0.35)",
	},
	headerBadge: {
		fontSize: "11px",
		padding: "4px 10px",
		borderRadius: "999px",
		background: "rgba(16, 185, 129, 0.18)",
		color: "#34d399",
		border: "1px solid rgba(52,211,153,0.4)",
	},
	closeBtn: {
		background: "rgba(255,255,255,0.06)",
		color: "#e2e8f0",
		border: "1px solid rgba(255,255,255,0.12)",
		borderRadius: "10px",
		padding: "8px 10px",
		cursor: "pointer",
		fontWeight: 700,
	},
	body: {
		flex: 1,
		padding: "14px",
		overflowY: "auto",
		background:
			"radial-gradient(circle at 20% 20%, rgba(79,70,229,0.08), transparent 28%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.08), transparent 32%), #0b1220",
	},
	footer: {
		padding: "12px",
		borderTop: "1px solid rgba(255,255,255,0.08)",
		display: "flex",
		gap: "10px",
		alignItems: "center",
		background: "rgba(10, 14, 26, 0.9)",
	},
	msg: {
		user: {
			alignSelf: "flex-end",
			background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
			color: "#fff",
			boxShadow: "0 10px 28px rgba(37, 99, 235, 0.35)",
			border: "1px solid rgba(255,255,255,0.06)",
		},
		ai: {
			alignSelf: "flex-start",
			background: "rgba(255,255,255,0.05)",
			color: "#e2e8f0",
			border: "1px solid rgba(255,255,255,0.06)",
			backdropFilter: "blur(6px)",
		},
	},
	attachments: {
		container: {
			marginTop: "10px",
			padding: "10px",
			border: "1px dashed rgba(255,255,255,0.18)",
			borderRadius: "12px",
			background: "rgba(255,255,255,0.03)",
		},
		item: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", wordBreak: "break-all" },
		link: { color: "#38bdf8", textDecoration: "underline", cursor: "pointer" },
		pillWrap: {
			display: "flex",
			flexWrap: "wrap",
			gap: "6px",
			marginTop: "6px",
		},
		pill: {
			display: "inline-flex",
			alignItems: "center",
			gap: "6px",
			padding: "7px 10px",
			background: "rgba(56, 189, 248, 0.12)",
			borderRadius: "20px",
			fontSize: "12px",
			color: "#e2e8f0",
			border: "1px solid rgba(56,189,248,0.4)",
		},
		remove: {
			border: "none",
			background: "transparent",
			cursor: "pointer",
			color: "#94a3b8",
			fontWeight: 700,
		},
	},
	citation: {
		background: "rgba(79,70,229,0.15)",
		border: "1px solid rgba(129,140,248,0.4)",
		borderRadius: "10px",
		padding: "8px 10px",
		fontSize: "12px",
		marginTop: "8px",
		color: "#e2e8f0",
	},
};

const loadHistory = (key) => {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return [];
		return JSON.parse(raw);
	} catch (e) {
		return [];
	}
};

const saveHistory = (key, data) => {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch {
		// ignore
	}
};

const AiChatWidget = () => {
	const { userId, role } = useMemo(() => getUserInfo(), []);
	const storageKey = useMemo(
		() => (userId ? `${storageKeyBase}_${userId}` : storageKeyBase),
		[userId],
	);
	const [open, setOpen] = useState(false);
	const [history, setHistory] = useState(() => loadHistory(storageKey));
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);
	const fileInputRef = useRef(null);

	useEffect(() => {
		// cleanup legacy shared history key to avoid cross-student collisions
		localStorage.removeItem(storageKeyBase);
	}, []);

	useEffect(() => {
		saveHistory(storageKey, history);
	}, [history, storageKey]);

	const toggle = () =>
		setOpen((v) => {
			const next = !v;
			if (next) {
				setHistory((h) => {
					const exists = h.some((m) => m.role === "ai" && m.text === welcomeMsg);
					if (exists) return h;
					return [...h, { role: "ai", text: welcomeMsg, citations: [] }];
				});
			}
			return next;
		});

	const onSend = async () => {
		const trimmed = message.trim();
		if (!trimmed && selectedFiles.length === 0) return;
		setError("");
		const filesToSend = selectedFiles;
		const userEntry = {
			role: "user",
			text: trimmed,
			attachments: filesToSend.map((file) => ({
				originalName: file.name,
				mimeType: file.type,
				size: file.size,
				url: null,
			})),
		};
		setHistory((h) => [...h, userEntry]);
		setMessage("");
		setSelectedFiles([]);
		if (fileInputRef.current) fileInputRef.current.value = "";
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("message", trimmed);
			filesToSend.forEach((file) => formData.append("attachments", file));
			const res = await fetch(`${API_URL}/ai/chat`, {
				method: "POST",
				credentials: "include",
				body: formData,
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Chat failed");
			if (data.attachments && Array.isArray(data.attachments)) {
				setHistory((h) => {
					const next = [...h];
					for (let i = next.length - 1; i >= 0; i -= 1) {
						if (next[i].role === "user") {
							next[i] = { ...next[i], attachments: data.attachments };
							break;
						}
					}
					return next;
				});
			}
			const aiText = data.inScope
				? data.answer || "No answer returned."
				: "سؤالك خارج نطاق المواد المسجلة لديك.";
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
			setHistory((h) => [...h, { role: "ai", text: "تعذر إرسال الرسالة. حاول لاحقاً." }]);
		} finally {
			setLoading(false);
		}
	};

	const handleFileSelect = (e) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;
		const capped = files.slice(0, 3);
		setSelectedFiles((prev) => [...prev, ...capped].slice(0, 3));
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const removeSelectedFile = (index) => {
		setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
	};

	const isStudent = role === "user";

	if (!isStudent) return null;

	return (
		<div style={baseStyles.wrapper}>
			{open ? (
				<div style={baseStyles.panel}>
					<div style={baseStyles.header}>
						<div style={baseStyles.headerTitle}>
							<div style={baseStyles.headerIcon}>AI</div>
							<div>
								<div style={{ fontSize: "15px" }}>AI Study Helper</div>
								<div style={{ fontSize: "12px", color: "#94a3b8" }}>ردود فورية ومصادر موثوقة</div>
							</div>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
							<span style={baseStyles.headerBadge}>متصل الآن</span>
							<button onClick={toggle} style={baseStyles.closeBtn}>
								×
							</button>
						</div>
					</div>
					<div style={baseStyles.body}>
						<div
							style={{
								marginBottom: "12px",
								padding: "10px 12px",
								borderRadius: "12px",
								background: "rgba(34,197,94,0.08)",
								border: "1px solid rgba(34,197,94,0.22)",
								color: "#bbf7d0",
								fontSize: "13px",
								lineHeight: 1.5,
							}}
						>
							النطاق: يجيب فقط عن أسئلتك ضمن المواد المسجلة لديك. اذكر اسم المادة لتضييق النطاق.
						</div>
						{history.map((msg, idx) => (
							<div
								key={idx}
								style={{
									marginBottom: "12px",
									display: "flex",
									justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
								}}
							>
								<div
									style={{
										maxWidth: "82%",
										padding: "12px 14px",
										borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
										...baseStyles.msg[msg.role === "user" ? "user" : "ai"],
									}}
								>
									<div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{msg.text}</div>
									{msg.attachments && msg.attachments.length > 0 && (
										<div style={baseStyles.attachments.container}>
											<strong style={{ fontSize: "12px" }}>المرفقات:</strong>
											<div style={{ marginTop: "6px", display: "grid", gap: "6px" }}>
												{msg.attachments.map((att, aIdx) => {
													const sizeKb = att.size ? Math.max(1, Math.round(att.size / 1024)) : null;
													const label = `${att.originalName || "Attachment"}${
														sizeKb ? ` (${sizeKb}KB)` : ""
													}`;
													return att.url ? (
														<a
															key={aIdx}
															href={att.url}
															target="_blank"
															rel="noreferrer"
															style={{ ...baseStyles.attachments.item, ...baseStyles.attachments.link }}
														>
															{label}
														</a>
													) : (
														<span key={aIdx} style={baseStyles.attachments.item}>
															{label}
														</span>
													);
												})}
											</div>
										</div>
									)}
									{msg.citations && msg.citations.length > 0 && (
										<div style={baseStyles.citation}>
											<strong>References:</strong>
											<ul style={{ paddingLeft: "18px", margin: "4px 0" }}>
												{msg.citations.map((c, cidx) => (
													<li key={cidx} style={{ marginBottom: "2px" }}>
														{c.lessonTitle || "Lesson"} | {c.courseTitle || "Course"}
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						))}
						{error && <div style={{ color: "#f87171", fontSize: "13px" }}>{error}</div>}
					</div>
					{selectedFiles.length > 0 && (
						<div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "#0d1424" }}>
							<div style={{ fontSize: "13px", color: "#e2e8f0" }}>الملفات المرفقة (حد أقصى 3):</div>
							<div style={baseStyles.attachments.pillWrap}>
								{selectedFiles.map((file, idx) => (
									<div key={`${file.name}-${idx}`} style={baseStyles.attachments.pill}>
										<span>{file.name}</span>
										<button
											type="button"
											onClick={() => removeSelectedFile(idx)}
											style={baseStyles.attachments.remove}
										>
											x
										</button>
									</div>
								))}
							</div>
						</div>
					)}
					<div style={baseStyles.footer}>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={loading}
							style={{
								background: "rgba(255,255,255,0.06)",
								color: "#e2e8f0",
								border: "1px solid rgba(255,255,255,0.12)",
								borderRadius: "10px",
								padding: "0 12px",
								cursor: loading ? "not-allowed" : "pointer",
								height: "46px",
								minWidth: "82px",
							}}
						>
							أرفق ملف
						</button>
						<input
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="اكتب سؤالك..."
							style={{
								flex: 1,
								border: "1px solid rgba(255,255,255,0.12)",
								background: "rgba(255,255,255,0.04)",
								color: "#e2e8f0",
								borderRadius: "12px",
								padding: "12px 12px",
								minHeight: "46px",
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									onSend();
								}
							}}
						/>
						<input
							type="file"
							ref={fileInputRef}
							accept="image/*,.pdf,.doc,.docx,.txt"
							multiple
							onChange={handleFileSelect}
							style={{ display: "none" }}
						/>
						<button
							onClick={onSend}
							disabled={loading}
							style={{
								background: loading ? "rgba(255,255,255,0.12)" : "linear-gradient(135deg, #22c55e, #10b981)",
								color: "#0b1220",
								border: "none",
								borderRadius: "12px",
								padding: "0 16px",
								minWidth: "86px",
								height: "46px",
								cursor: loading ? "not-allowed" : "pointer",
								fontWeight: 700,
								boxShadow: loading ? "none" : "0 10px 26px rgba(34, 197, 94, 0.35)",
							}}
						>
							{loading ? "..." : "إرسال"}
						</button>
					</div>
				</div>
			) : (
				<button style={baseStyles.button} onClick={toggle}>
					افتح AI Study Helper
				</button>
			)}
		</div>
	);
};

export default AiChatWidget;
