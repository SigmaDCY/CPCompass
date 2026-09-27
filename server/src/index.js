const corsHeaders =
{
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, X-CP-Compass-API-Token"
}

export default
	{
		async fetch(request, env, ctx)
		{
			if (request.method === "OPTIONS")
			{
				return new Response(null, { headers: corsHeaders });
			}
			const url = new URL(request.url);

			if (url.pathname === "/submit") // 提交代码
			{
				if (request.method === "POST")
				{
					const token = request.headers.get("X-CP-Compass-API-Token");
					if (!token || token !== env.API_TOKEN)
					{
						console.log("Unauthorized access attempt with token:", token);
						return new Response("Unauthorized", { status: 401, headers: corsHeaders });
					}
					const data = await request.json(); // 解析JSON数据
					console.log("Received data:", data);

					// 将数据插入到SQLite数据库中
					const stmt = env.db.prepare("INSERT OR IGNORE INTO submissions (source, submissionId, problemId, verdict, score, submissionTime, code) VALUES (?, ?, ?, ?, ?, ?, ?)");
					await stmt.bind(data.source, data.submissionId, data.problemId, data.verdict, data.score, data.submissionTime, data.code).run();

					return new Response(JSON.stringify({ message: "Data inserted successfully" }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
				}
				else
				{
					return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
				}
			}
			else if (url.pathname === "/api/submissions") // 查询已提交的代码
			{
				if (request.method === "GET")
				{
					const result = await env.db.prepare("SELECT id, source, submissionId, problemId, verdict, score, submissionTime FROM submissions ORDER BY id DESC LIMIT 50").all();
					return new Response(JSON.stringify(result.results), { headers: { "Content-Type": "application/json", ...corsHeaders } });
				}
			}
			else if (url.pathname === '/')
			{
				return env.ASSETS.fetch(request);
			}
			else
			{
				return new Response("Not Found", { status: 404, headers: corsHeaders });
			}
		}
	};