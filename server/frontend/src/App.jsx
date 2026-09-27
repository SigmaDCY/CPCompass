import { useState, useEffect } from "react"
import "./index.css"

function App()
{
	const [submissions, setSubmissions] = useState([]);
	useEffect(() =>
	{
		fetch("api/submissions").then(res => res.json()).then(data => setSubmissions(data)) // 收到响应后解析 json 然后传递给 data
	}, []) // 只执行一次
	return (
		<div className="min-h-screen p-8" style={{ background: 'linear-gradient(to right, #07121f, #0e2336)' }}>
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-sky-400 mb-8">CP Compass Dashboard</h1>

				<div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
					<table className="w-full text-left">
						<thead className="text-sky-200 bg-transparent border-white/10 border-b">
							<tr>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">来源</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">提交编号</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">题目</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">分数</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">状态</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">提交时间</th>
							</tr>
						</thead>
						<tbody>
							{submissions.map((item) => (
								<tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
									<td className="px-6 py-4 text-white font-medium">{item.source}</td>
									<td className="px-6 py-4 text-white font-medium">{item.submissionId.substring(2)}</td>
									<td className="px-6 py-4 text-sm text-gray-500">{item.problemId}</td>
									<td className="px-6 py-4 text-sm font-bold" style={{ color: `hsl(${item.score * 1.2}, 80%, 60%)` }}>{item.score}</td>
									<td className={`px-6 py-4 text-sm font-bold ${item.verdict === "Accepted" ? "text-green-400" : "text-red-400"}`}>
										{item.verdict}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">{item.submissionTime}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default App;