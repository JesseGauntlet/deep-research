import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { deepResearch, writeFinalReport } from './deep-research.js';

// Create an MCP server
const server = new McpServer({
  name: 'Deep Context',
  version: '0.1.0',
});

// Add the deep research tool
server.tool(
  'research',
  {
    query: z.string().describe('The research query/topic to investigate'),
    breadth: z.number().optional().default(4).describe('Number of parallel search queries per depth level'),
    depth: z.number().optional().default(2).describe('How many levels deep to research'),
  },
  async (params: { query: string; breadth?: number; depth?: number }) => {
    try {
      // Run the research
      const result = await deepResearch({
        query: params.query,
        breadth: params.breadth ?? 4,
        depth: params.depth ?? 2,
        // No progress callback needed for MCP
      });

      // Generate the final report
      const report = await writeFinalReport({
        prompt: params.query,
        learnings: result.learnings,
        visitedUrls: result.visitedUrls,
      });

      return {
        content: [
          {
            type: 'text',
            text: report,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error during research: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

async function main() {
  try {
    // Start the server using stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

main(); 