import { CodeIcon, RocketLaunchIcon, UsersIcon, IslandIcon, KanbanIcon } from "@phosphor-icons/react/dist/ssr";
import NodeJsIcon from "@/components/svg/framework/NodeJsIcon";
import NextJsIcon from "@/components/svg/framework/NextJsIcon";
import PostgreIcon from "@/components/svg/data/PostgreIcon";
import DockerIcon from "@/components/svg/tools/DockerIcon";
import ReactIcon from "@/components/svg/tools/ReactIcon";
import TSIcon from "@/components/svg/lang/TsIcon";

export const default_attributes = [
	{
		Icon: CodeIcon,
		title: "Problem Solver",
		gradient: "from-blue-500 to-cyan-500",
		description: "I love tackling complex challenges and finding elegant solutions through code.",
	},
	{
		Icon: IslandIcon,
		title: "Creative Designer",
		gradient: "from-purple-500 to-pink-500",
		description: "Combining aesthetics with functionality to create beautiful user experiences.",
	},
	{
		Icon: RocketLaunchIcon,
		title: "Innovation Driven",
		gradient: "from-orange-500 to-red-500",
		description: "Always exploring new technologies and pushing the boundaries of what's possible.",
	},
	{
		Icon: UsersIcon,
		title: "Team Player",
		gradient: "from-green-500 to-emerald-500",
		description: "Collaborative approach to development with strong communication skills.",
	},
	{
		Icon: KanbanIcon,
		title: "Fast Learner",
		description: "Quick to adapt to new technologies and frameworks in the ever-evolving tech landscape.",
		gradient: "from-yellow-500 to-orange-500",
	},
];

export const default_technologies = [
	{
		name: "React",
		Icon: ReactIcon,
		proficiency: 95,
		category: "Frontend",
		color: "from-blue-400 to-blue-600",
		description: "A JavaScript library for building user interfaces with component-based architecture.",
	},
	{
		name: "Next.js",
		proficiency: 90,
		Icon: NextJsIcon,
		category: "Frontend",
		color: "from-gray-700 to-gray-900",
		description: "The React framework for production with server-side rendering and static generation.",
	},
	{
		Icon: TSIcon,
		proficiency: 88,
		name: "TypeScript",
		category: "Language",
		color: "from-blue-500 to-blue-700",
		description: "Typed superset of JavaScript that compiles to plain JavaScript.",
	},
	{
		proficiency: 85,
		name: "Node.js",
		icon: NodeJsIcon,
		category: "Backend",
		color: "from-green-500 to-green-700",
		description: "JavaScript runtime built on Chrome's V8 JavaScript engine for server-side development.",
	},
	{
		icon: "🐍",
		name: "Python",
		proficiency: 80,
		category: "Backend",
		color: "from-yellow-400 to-yellow-600",
		description: "High-level programming language with elegant syntax and powerful libraries.",
	},
	{
		proficiency: 82,
		icon: PostgreIcon,
		name: "PostgreSQL",
		category: "Database",
		color: "from-blue-600 to-indigo-600",
		description: "Advanced open-source relational database with strong SQL compliance.",
	},
	{
		icon: "☁️",
		name: "AWS",
		proficiency: 75,
		category: "Cloud",
		color: "from-orange-400 to-orange-600",
		description: "Comprehensive cloud computing platform with extensive service offerings.",
	},
	{
		name: "Docker",
		proficiency: 78,
		icon: DockerIcon,
		category: "DevOps",
		color: "from-blue-500 to-cyan-500",
		description: "Platform for developing, shipping, and running applications in containers.",
	},
];
