"""
Rich seed data containing campaigns, quests, calendar blocks, skill trees, quiz questions, remedial RAG resources, and rewards.
"""
from models.database import (
    StudentProfile, SkillNode, Quest, CalendarBlock, Campaign,
    QuizQuestion, RemedialResource, RewardItem, AgentThoughtLog
)
from datetime import datetime, date, timedelta

INITIAL_PROFILE = StudentProfile(
    id="hero-1",
    name="Alex Rivers",
    title="F-Rank Novice",
    rank="F",
    level=1,
    xp=120,
    next_level_xp=500,
    gold=280,
    streak_days=4,
    streak_shield_active=False,
    dda_mode="Adventurer",
    rolling_mastery=68.0,
    active_campaign_id="camp-dsa",
    daily_available_hours=3.0,
    exam_target_date="2026-10-30",
    character_class="Algorithm Apprentice"
)

INITIAL_CAMPAIGNS = [
    Campaign(
        id="camp-dsa",
        title="Main Campaign: The Graph & DP Trials",
        description="Master foundational to advanced Graph Algorithms, Shortest Paths, Dynamic Programming & Trees.",
        icon="⚔️",
        total_quests=12,
        completed_quests=4,
        target_date="2026-10-30",
        status="active",
        category="Algorithms"
    ),
    Campaign(
        id="camp-sys",
        title="Side Campaign: Distributed Systems Forge",
        description="Construct resilient architectures, Raft consensus, caching strategies, and event-driven pipelines.",
        icon="🛡️",
        total_quests=8,
        completed_quests=1,
        target_date="2026-11-15",
        status="active",
        category="Systems"
    ),
    Campaign(
        id="camp-ml",
        title="Special Campaign: Deep Learning Citadel",
        description="Conquer Neural Networks, Backpropagation calculus, Attention Mechanisms, and Transformer models.",
        icon="🔮",
        total_quests=10,
        completed_quests=0,
        target_date="2026-12-01",
        status="locked",
        category="AI & Math"
    )
]

def generate_initial_quests_and_calendar():
    today = date.today()
    today_str = today.strftime("%Y-%m-%d")
    yesterday_str = (today - timedelta(days=1)).strftime("%Y-%m-%d")
    two_days_ago_str = (today - timedelta(days=2)).strftime("%Y-%m-%d")
    tomorrow_str = (today + timedelta(days=1)).strftime("%Y-%m-%d")
    day_after_str = (today + timedelta(days=2)).strftime("%Y-%m-%d")
    day_3_str = (today + timedelta(days=3)).strftime("%Y-%m-%d")
    day_4_str = (today + timedelta(days=4)).strftime("%Y-%m-%d")

    quests = [
        Quest(
            id="q-1",
            campaign_id="camp-dsa",
            title="Syllabus Recon: Graph Representations & Adjacency",
            topic="Graphs",
            subtopic="Graph Representations",
            difficulty="Easy",
            xp_reward=100,
            gold_reward=50,
            estimated_minutes=45,
            status="completed",
            prerequisite_quest_ids=[],
            scheduled_date=two_days_ago_str,
            scheduled_time="18:00",
            mastery_score=92.0
        ),
        Quest(
            id="q-2",
            campaign_id="camp-dsa",
            title="The Maze of Traversal: BFS & Breadth Exploration",
            topic="Graphs",
            subtopic="Breadth-First Search",
            difficulty="Easy",
            xp_reward=120,
            gold_reward=60,
            estimated_minutes=50,
            status="completed",
            prerequisite_quest_ids=["q-1"],
            scheduled_date=yesterday_str,
            scheduled_time="17:00",
            mastery_score=85.0
        ),
        Quest(
            id="q-3",
            campaign_id="camp-dsa",
            title="The Shadow Abyss: Depth-First Search & Backtracking",
            topic="Graphs",
            subtopic="Depth-First Search",
            difficulty="Medium",
            xp_reward=150,
            gold_reward=75,
            estimated_minutes=60,
            status="completed",
            prerequisite_quest_ids=["q-2"],
            scheduled_date=yesterday_str,
            scheduled_time="19:00",
            mastery_score=78.0
        ),
        Quest(
            id="q-4",
            campaign_id="camp-dsa",
            title="Boss Challenge: Dijkstra's Shortest Path Algorithm",
            topic="Graphs",
            subtopic="Dijkstras Algorithm",
            difficulty="Hard",
            xp_reward=250,
            gold_reward=120,
            estimated_minutes=75,
            status="in_progress",
            prerequisite_quest_ids=["q-3"],
            scheduled_date=today_str,
            scheduled_time="18:00",
            mastery_score=None
        ),
        Quest(
            id="q-5",
            campaign_id="camp-dsa",
            title="The Web of Flow: Bellman-Ford & Negative Cycles",
            topic="Graphs",
            subtopic="Bellman-Ford",
            difficulty="Hard",
            xp_reward=220,
            gold_reward=100,
            estimated_minutes=60,
            status="pending",
            prerequisite_quest_ids=["q-4"],
            scheduled_date=tomorrow_str,
            scheduled_time="17:30"
        ),
        Quest(
            id="q-6",
            campaign_id="camp-dsa",
            title="The Spanning Bastion: Kruskal & Prim MST",
            topic="Graphs",
            subtopic="Minimum Spanning Tree",
            difficulty="Medium",
            xp_reward=180,
            gold_reward=90,
            estimated_minutes=60,
            status="pending",
            prerequisite_quest_ids=["q-4"],
            scheduled_date=day_after_str,
            scheduled_time="18:00"
        ),
        Quest(
            id="q-7",
            campaign_id="camp-dsa",
            title="The Memoization Shrine: 1D Dynamic Programming",
            topic="Dynamic Programming",
            subtopic="1D DP Memoization",
            difficulty="Medium",
            xp_reward=200,
            gold_reward=100,
            estimated_minutes=60,
            status="pending",
            prerequisite_quest_ids=["q-6"],
            scheduled_date=day_3_str,
            scheduled_time="17:00"
        ),
        Quest(
            id="q-8",
            campaign_id="camp-dsa",
            title="Grand Boss: 0/1 Knapsack & 2D Grid DP",
            topic="Dynamic Programming",
            subtopic="2D Knapsack",
            difficulty="Boss",
            xp_reward=350,
            gold_reward=180,
            estimated_minutes=90,
            status="pending",
            prerequisite_quest_ids=["q-7"],
            scheduled_date=day_4_str,
            scheduled_time="18:30"
        )
    ]

    calendar = [
        CalendarBlock(
            id="cal-1",
            quest_id="q-1",
            title="Completed: Graph Representations",
            topic="Graphs",
            subtopic="Graph Representations",
            date_str=two_days_ago_str,
            start_time="18:00",
            end_time="18:45",
            duration_min=45,
            status="completed",
            note="Flawless execution! 92% mastery."
        ),
        CalendarBlock(
            id="cal-2",
            quest_id="q-2",
            title="Completed: BFS & Breadth Exploration",
            topic="Graphs",
            subtopic="Breadth-First Search",
            date_str=yesterday_str,
            start_time="17:00",
            end_time="17:50",
            duration_min=50,
            status="completed",
            note="Good queue implementation."
        ),
        CalendarBlock(
            id="cal-3",
            quest_id="q-3",
            title="Completed: DFS & Backtracking",
            topic="Graphs",
            subtopic="Depth-First Search",
            date_str=yesterday_str,
            start_time="19:00",
            end_time="20:00",
            duration_min=60,
            status="completed",
            note="Mastered recursion call stack."
        ),
        CalendarBlock(
            id="cal-4",
            quest_id="q-4",
            title="ACTIVE: Dijkstra's Algorithm & Priority Queue",
            topic="Graphs",
            subtopic="Dijkstras Algorithm",
            date_str=today_str,
            start_time="18:00",
            end_time="19:15",
            duration_min=75,
            status="upcoming",
            note="High priority prerequisite for Shortest Paths."
        ),
        CalendarBlock(
            id="cal-5",
            quest_id="q-5",
            title="Scheduled: Bellman-Ford & Negative Cycles",
            topic="Graphs",
            subtopic="Bellman-Ford",
            date_str=tomorrow_str,
            start_time="17:30",
            end_time="18:30",
            duration_min=60,
            status="upcoming"
        ),
        CalendarBlock(
            id="cal-6",
            quest_id="q-6",
            title="Scheduled: Kruskal & Prim MST",
            topic="Graphs",
            subtopic="Minimum Spanning Tree",
            date_str=day_after_str,
            start_time="18:00",
            end_time="19:00",
            duration_min=60,
            status="upcoming"
        )
    ]

    return quests, calendar

INITIAL_SKILL_NODES = [
    SkillNode(
        id="sk-arrays",
        name="Array & Matrix Mastery",
        branch="Data Structures",
        level=3,
        max_level=5,
        xp_cost=150,
        unlocked=True,
        icon="🧱",
        description="Foundation of sequential data storage, 2-pointer techniques, and sliding windows.",
        bonus_perk="+10% XP on Array and String quests."
    ),
    SkillNode(
        id="sk-graphs",
        name="Graph Cartography",
        branch="Algorithms",
        level=2,
        max_level=5,
        xp_cost=200,
        unlocked=True,
        icon="🌐",
        description="Traverse non-linear node spaces, shortest paths, and network topologies.",
        bonus_perk="Unlocks Boss Quests for Dijkstra & Bellman-Ford.",
        prerequisites=["sk-arrays"]
    ),
    SkillNode(
        id="sk-dp",
        name="Dynamic Programming Oracle",
        branch="Algorithms",
        level=0,
        max_level=5,
        xp_cost=250,
        unlocked=False,
        icon="💎",
        description="Harness optimal substructure and overlapping subproblems to solve polynomial puzzles.",
        bonus_perk="Reduces remedial quest duration by 15 minutes.",
        prerequisites=["sk-graphs"]
    ),
    SkillNode(
        id="sk-trees",
        name="Binary Tree & Heap Wisdom",
        branch="Data Structures",
        level=2,
        max_level=5,
        xp_cost=180,
        unlocked=True,
        icon="🌲",
        description="Priority queues, AVL trees, and segment trees for lightning fast range queries.",
        bonus_perk="Grants +25 Gold on Tree Boss Battles.",
        prerequisites=["sk-arrays"]
    ),
    SkillNode(
        id="sk-sys",
        name="Distributed Systems Shield",
        branch="Systems",
        level=1,
        max_level=5,
        xp_cost=220,
        unlocked=True,
        icon="⚙️",
        description="Understand network partitions, CAP theorem, and event sourcing.",
        bonus_perk="+1 Daily Streak Shield protection.",
        prerequisites=[]
    ),
    SkillNode(
        id="sk-math",
        name="Discrete Math & Proofs",
        branch="AI & Math",
        level=1,
        max_level=5,
        xp_cost=200,
        unlocked=True,
        icon="📐",
        description="Combinatorics, Big-O asymptotics, and modular arithmetic.",
        bonus_perk="Reveals 1 free hint per Diagnostic Quiz.",
        prerequisites=[]
    )
]

INITIAL_REWARDS = [
    RewardItem(
        id="rew-game",
        title="1-Hour Guilt-Free Gaming Break",
        description="Unwind in Elden Ring, Valorant, or Zelda knowing your daily study quota was crushed.",
        category="real_world",
        coin_cost=150,
        icon="🎮",
        is_custom=False,
        redeemed_count=3
    ),
    RewardItem(
        id="rew-boba",
        title="Boba Tea / Street Food Feast",
        description="Treat your tastebuds to a delicious iced beverage or your favorite local street snack.",
        category="real_world",
        coin_cost=200,
        icon="🧋",
        is_custom=False,
        redeemed_count=2
    ),
    RewardItem(
        id="rew-nap",
        title="30-Minute Power Nap of the Gods",
        description="A peaceful, guilt-free restorative nap to supercharge your brain's memory consolidation.",
        category="real_world",
        coin_cost=100,
        icon="😴",
        is_custom=False,
        redeemed_count=4
    ),
    RewardItem(
        id="rew-netflix",
        title="Guilt-Free Movie or 2 Episodes",
        description="Stream your favorite anime or movie without the looming dread of pending assignments.",
        category="real_world",
        coin_cost=250,
        icon="🍿",
        is_custom=False,
        redeemed_count=1
    ),
    RewardItem(
        id="rew-hint",
        title="Guild Master's Divine Hint Scroll",
        description="Instant step-by-step hint breakdown for any tricky quiz question or coding drill.",
        category="in_game",
        coin_cost=80,
        icon="📜",
        is_custom=False,
        redeemed_count=6
    ),
    RewardItem(
        id="rew-shield",
        title="Streak Shield Crystal",
        description="Protects your active study streak if an unforeseen emergency occurs.",
        category="in_game",
        coin_cost=180,
        icon="🛡️",
        is_custom=False,
        redeemed_count=1
    ),
    RewardItem(
        id="rew-potion",
        title="2x XP Surge Elixir",
        description="Doubles all XP earned from study blocks and quizzes for the next 24 hours.",
        category="in_game",
        coin_cost=220,
        icon="🧪",
        is_custom=False,
        redeemed_count=0
    )
]

QUIZ_QUESTION_BANK = [
    # Dijkstra's Algorithm
    QuizQuestion(
        id="dijk-1",
        topic="Graphs",
        subtopic="Dijkstras Algorithm",
        difficulty="Medium",
        question="Why does standard Dijkstra's algorithm fail or enter infinite loops on graphs with negative-weight edges?",
        options=[
            "It uses a FIFO queue which cannot handle negative values.",
            "It greedily assumes that once a node is finalized with minimum distance, no shorter path to it exists.",
            "It cannot calculate adjacency matrices of directed edges.",
            "It only works on bipartite graphs."
        ],
        correct_idx=1,
        explanation="Dijkstra's relies on the greedy property: when a vertex u is extracted from the min-priority queue, its distance is finalized because all edge weights are >= 0. Negative edges invalidate this invariant.",
        hint="Consider the greedy choice assumption when extracting from the priority queue."
    ),
    QuizQuestion(
        id="dijk-2",
        topic="Graphs",
        subtopic="Dijkstras Algorithm",
        difficulty="Hard",
        question="What is the optimal time complexity of Dijkstra's algorithm implemented with a Min-Indexed Binary Heap for a graph with V vertices and E edges?",
        code_snippet="""// Dijkstra Min-Heap loop:
while (!pq.isEmpty()) {
    auto [d, u] = pq.top(); pq.pop();
    for (auto& [v, weight] : adj[u]) {
        if (dist[u] + weight < dist[v]) {
            dist[v] = dist[u] + weight;
            pq.push({dist[v], v});
        }
    }
}""",
        options=[
            "O(V^2)",
            "O(E * log(V))",
            "O(V * E)",
            "O(V + E)"
        ],
        correct_idx=1,
        explanation="Each vertex is extracted from the heap at most once (V * log V), and each edge relaxation might update the heap (E * log V), giving O((V + E) log V) which is O(E log V) in connected graphs.",
        hint="Think about the heap operations performed for each vertex pop and edge relaxation."
    ),
    QuizQuestion(
        id="dijk-3",
        topic="Graphs",
        subtopic="Dijkstras Algorithm",
        difficulty="Medium",
        question="If you discover that a graph contains negative edge weights but NO negative cycles, which algorithm should the Guild Master recommend instead of Dijkstra?",
        options=[
            "Floyd-Warshall (for single source)",
            "Bellman-Ford Algorithm",
            "Prim's MST Algorithm",
            "Tarjan's Strongly Connected Components"
        ],
        correct_idx=1,
        explanation="The Bellman-Ford algorithm safely relaxes all edges V-1 times and can correctly handle negative edge weights (and detect negative cycles).",
        hint="This algorithm relaxes all edges V-1 times."
    ),
    # BFS & DFS
    QuizQuestion(
        id="bfs-1",
        topic="Graphs",
        subtopic="Breadth-First Search",
        difficulty="Easy",
        question="In an unweighted graph, which algorithm is guaranteed to find the shortest path in O(V + E) time?",
        options=[
            "Depth-First Search (DFS)",
            "Breadth-First Search (BFS)",
            "Topological Sort",
            "A* Search with zero heuristic"
        ],
        correct_idx=1,
        explanation="BFS traverses nodes in layer-by-layer order of distance from the source, guaranteeing shortest path in unweighted graphs.",
        hint="Layer-by-layer traversal using a FIFO queue."
    ),
    # Dynamic Programming
    QuizQuestion(
        id="dp-1",
        topic="Dynamic Programming",
        subtopic="1D DP Memoization",
        difficulty="Medium",
        question="What are the two essential characteristics a problem must possess to be effectively solved via Dynamic Programming?",
        options=[
            "Greedy choice property & Divide-and-Conquer",
            "Overlapping Subproblems & Optimal Substructure",
            "NP-Completeness & Polynomial Verification",
            "Binary Symmetry & Monotonicity"
        ],
        correct_idx=1,
        explanation="Dynamic Programming requires: 1. Optimal Substructure (optimal solution comes from optimal subproblems) and 2. Overlapping Subproblems (the same subproblems are solved repeatedly).",
        hint="Think about memoizing identical recursive sub-calls."
    )
]

REMEDIAL_KNOWLEDGE_BASE = [
    RemedialResource(
        id="rem-dijkstra",
        subtopic="Dijkstras Algorithm",
        topic="Graphs",
        title="Dijkstra's Invariant & Priority Queue Mechanics",
        summary="A comprehensive remedial breakdown of Dijkstra's greedy choice property, edge relaxation, and why negative edges break the algorithm.",
        key_takeaways=[
            "Greedy Invariant: The moment a vertex u is popped from the min-heap, its shortest distance is globally settled.",
            "Negative Weights Flaw: If an edge (u, v) has a negative weight, a path through an unvisited vertex could later yield a smaller distance, violating the settled status.",
            "Heap Optimization: Use a Min-Heap (or priority_queue in C++ / heapq in Python) to achieve O((V+E) log V) time.",
            "Alternative: If negative edge weights exist, switch to Bellman-Ford (O(V*E))."
        ],
        code_analogy="Think of Dijkstra like water ripples expanding uniformly in all directions at 1 meter/second. The first ripple to hit an island is guaranteed to be the shortest travel time. Negative edge weights would be like a time machine sending water backwards, confusing the ripple detector!",
        code_example="""import heapq

def dijkstra(graph, start, num_nodes):
    # dist table initialized to infinity
    distances = {i: float('inf') for i in range(num_nodes)}
    distances[start] = 0
    
    # Priority Queue stores tuples of (current_dist, node)
    pq = [(0, start)]
    
    while pq:
        curr_dist, u = heapq.heappop(pq)
        
        # If we found a longer path already settled, skip
        if curr_dist > distances[u]:
            continue
            
        for v, weight in graph[u]:
            new_dist = curr_dist + weight
            # Relaxation Step:
            if new_dist < distances[v]:
                distances[v] = new_dist
                heapq.heappush(pq, (new_dist, v))
                
    return distances""",
        practice_drill="Write down a 3-node graph: A->B (weight 5), A->C (weight 2), C->B (weight -4). Trace step-by-step why standard Dijkstra reports dist[B]=5 instead of the true shortest path dist[B]=-2.",
        difficulty_fix="Scales difficulty down to Step-by-Step Visualization mode with automatic graph simulator."
    ),
    RemedialResource(
        id="rem-bfs",
        subtopic="Breadth-First Search",
        topic="Graphs",
        title="BFS Layer Traversal & Unweighted Shortest Paths",
        summary="Master the FIFO queue mechanics for shortest path exploration in unweighted graphs.",
        key_takeaways=[
            "Queue Invariant: Nodes at distance d are always processed before any node at distance d+1.",
            "Visited Set: Prevent cycles and redundant exploration by marking nodes as visited immediately upon enqueueing.",
            "Time Complexity: O(V + E) linear time."
        ],
        code_analogy="Imagine an ink droplet spreading into paper fibers one circle at a time.",
        practice_drill="Implement BFS to find the shortest transformation from word A to word B changing 1 letter at a time.",
        difficulty_fix="Focus on queue invariants and cycle prevention."
    ),
    RemedialResource(
        id="rem-dp-1d",
        subtopic="1D DP Memoization",
        topic="Dynamic Programming",
        title="Overlapping Subproblems & State Transitions",
        summary="Demystifying recursion with memoization versus bottom-up iterative table filling.",
        key_takeaways=[
            "Identify the State: What variables uniquely determine the subproblem?",
            "Base Cases: The simplest non-reducible sub-cases.",
            "Transition Formula: Express dp[i] purely in terms of previous smaller states."
        ],
        code_analogy="Instead of recalculating 1+1+1+1+1 every time someone asks, write down 5 on a sticky note and just add +1 next time.",
        practice_drill="Solve the House Robber problem using both memoized top-down recursion and bottom-up space-optimized iterative array.",
        difficulty_fix="Decompose DP into explicit DAG visual state transitions."
    )
]

INITIAL_THOUGHT_LOGS = [
    AgentThoughtLog(
        id="log-1",
        timestamp=datetime.now().strftime("%H:%M:%S"),
        phase="Analyze",
        trigger_event="System Initialization",
        thought_summary="Guild Master initialized. Scanning student profile Alex Rivers (Rank F, Level 1). Current active campaign: The Graph & DP Trials.",
        details={"campaign_id": "camp-dsa", "target_date": "2026-10-30", "rolling_mastery": 68.0},
        mood="tactical"
    ),
    AgentThoughtLog(
        id="log-2",
        timestamp=datetime.now().strftime("%H:%M:%S"),
        phase="Diagnose",
        trigger_event="Schedule Health Check",
        thought_summary="Prerequisites validated: Graph Representations (92%) and BFS (85%) completed. Up next: Boss Quest 'Dijkstra's Shortest Path Algorithm'.",
        details={"ready_quest": "q-4", "status": "all_prerequisites_met"},
        mood="thinking"
    )
]
