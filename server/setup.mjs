import { execSync } from "child_process";
import fs from "fs";

const result = execSync("npx wrangler d1 create cp-compass-db").toString(); // 获取输出结果
console.log(result); // 打印输出结果
const match = result.match(/database_id\s*=\s*"([^"]+)"/); // 使用正则表达式提取database_id

if (!match[1])
{
	console.error("Failed to extract database_id from the output.");
	process.exit(1);
}

const content = 'name = "cp-compass-server"\nmain = "src/index.js"\ncompatibility_date = "2026-09-25"\n\n[[d1_databases]]\nbinding = "db"\ndatabase_name = "cp-compass-db"\ndatabase_id = "' + match[1] + '"\n\n[assets]\ndirectory = "./public"\nbinding = "ASSETS"'; // 构建wrangler.toml内容
fs.writeFileSync("wrangler.toml", content); // 将database_id写入wrangler.toml文件

execSync('npx wrangler d1 execute cp-compass-db --local --file=schema.sql') // 建表
console.log("Database setup completed successfully.");