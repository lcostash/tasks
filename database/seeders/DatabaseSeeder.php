<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Task;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'admin',
            'email' => 'admin@taskflow.com',
            'password' => Hash::make('password'),
            'full_name' => 'Admin User',
            'phone' => '+1234567890',
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        echo "✓ Admin user created: admin@taskflow.com\n";

        // Create Regular Users
        $users = [
            [
                'name' => 'johndoe',
                'email' => 'john@example.com',
                'full_name' => 'John Doe',
                'phone' => '+1234567891',
            ],
            [
                'name' => 'janedoe',
                'email' => 'jane@example.com',
                'full_name' => 'Jane Doe',
                'phone' => '+1234567892',
            ],
            [
                'name' => 'bobsmith',
                'email' => 'bob@example.com',
                'full_name' => 'Bob Smith',
                'phone' => '+1234567893',
            ],
            [
                'name' => 'alicejones',
                'email' => 'alice@example.com',
                'full_name' => 'Alice Jones',
                'phone' => '+1234567894',
            ],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'full_name' => $userData['full_name'],
                'phone' => $userData['phone'],
                'role' => 'user',
                'email_verified_at' => now(),
            ]);
            $createdUsers[] = $user;
        }

        echo "✓ " . count($createdUsers) . " regular users created\n";

        // Create System Tags
        $systemTags = [
            ['name' => 'Urgent', 'color' => '#EF4444'],
            ['name' => 'Bug', 'color' => '#DC2626'],
            ['name' => 'Feature', 'color' => '#3B82F6'],
            ['name' => 'Enhancement', 'color' => '#8B5CF6'],
            ['name' => 'Documentation', 'color' => '#10B981'],
            ['name' => 'Design', 'color' => '#F59E0B'],
            ['name' => 'Testing', 'color' => '#6366F1'],
            ['name' => 'Research', 'color' => '#EC4899'],
        ];

        $createdTags = [];
        foreach ($systemTags as $tagData) {
            $tag = Tag::create([
                'name' => $tagData['name'],
                'color' => $tagData['color'],
                'is_system' => true,
                'user_id' => null,
            ]);
            $createdTags[] = $tag;
        }

        echo "✓ " . count($createdTags) . " system tags created\n";

        // Create Sample Tasks for Each User
        $taskTemplates = [
            [
                'title' => 'Setup development environment',
                'description' => 'Install all necessary tools and dependencies for the project',
                'status' => 'done',
                'tags' => ['Documentation', 'Feature'],
            ],
            [
                'title' => 'Design user interface mockups',
                'description' => 'Create wireframes and mockups for the main application screens',
                'status' => 'in_progress',
                'tags' => ['Design', 'Feature'],
            ],
            [
                'title' => 'Implement authentication system',
                'description' => 'Build secure login and registration functionality with OTP support',
                'status' => 'in_progress',
                'tags' => ['Feature', 'Urgent'],
            ],
            [
                'title' => 'Write unit tests',
                'description' => 'Add comprehensive test coverage for core functionality',
                'status' => 'to_do',
                'tags' => ['Testing'],
            ],
            [
                'title' => 'Fix navigation bug',
                'description' => 'Resolve issue where navigation menu doesn\'t work on mobile devices',
                'status' => 'to_do',
                'tags' => ['Bug', 'Urgent'],
            ],
            [
                'title' => 'Optimize database queries',
                'description' => 'Review and optimize slow database queries to improve performance',
                'status' => 'to_do',
                'tags' => ['Enhancement'],
            ],
            [
                'title' => 'Research new framework features',
                'description' => 'Investigate latest features and best practices for the tech stack',
                'status' => 'to_do',
                'tags' => ['Research'],
            ],
            [
                'title' => 'Update API documentation',
                'description' => 'Document all API endpoints with examples and descriptions',
                'status' => 'done',
                'tags' => ['Documentation'],
            ],
        ];

        $totalTasks = 0;
        foreach ($createdUsers as $user) {
            // Give each user 4-6 random tasks
            $numTasks = rand(4, 6);
            $userTasks = array_rand($taskTemplates, $numTasks);
            
            if (!is_array($userTasks)) {
                $userTasks = [$userTasks];
            }

            foreach ($userTasks as $taskIndex) {
                $template = $taskTemplates[$taskIndex];
                
                // Random due date within next 30 days
                $dueDate = null;
                if (rand(0, 1)) {
                    $dueDate = now()->addDays(rand(1, 30));
                }

                $task = Task::create([
                    'user_id' => $user->id,
                    'title' => $template['title'],
                    'description' => $template['description'],
                    'status' => $template['status'],
                    'due_date' => $dueDate,
                    'is_hidden' => false,
                ]);

                // Attach tags
                $tagIds = [];
                foreach ($template['tags'] as $tagName) {
                    $tag = collect($createdTags)->firstWhere('name', $tagName);
                    if ($tag) {
                        $tagIds[] = $tag->id;
                    }
                }
                $task->tags()->attach($tagIds);

                $totalTasks++;
            }
        }

        echo "✓ " . $totalTasks . " sample tasks created\n";
        
        // Create a few tasks for the admin user too
        foreach (array_slice($taskTemplates, 0, 3) as $template) {
            $task = Task::create([
                'user_id' => $admin->id,
                'title' => $template['title'],
                'description' => $template['description'],
                'status' => $template['status'],
                'due_date' => now()->addDays(rand(1, 15)),
                'is_hidden' => false,
            ]);

            $tagIds = [];
            foreach ($template['tags'] as $tagName) {
                $tag = collect($createdTags)->firstWhere('name', $tagName);
                if ($tag) {
                    $tagIds[] = $tag->id;
                }
            }
            $task->tags()->attach($tagIds);
        }

        echo "✓ 3 tasks created for admin user\n";

        echo "\n";
        echo "========================================\n";
        echo "Database seeding completed successfully!\n";
        echo "========================================\n";
        echo "\n";
        echo "Login credentials:\n";
        echo "  Admin: admin@taskflow.com / password\n";
        echo "  User 1: john@example.com / password\n";
        echo "  User 2: jane@example.com / password\n";
        echo "  User 3: bob@example.com / password\n";
        echo "  User 4: alice@example.com / password\n";
        echo "\n";
        echo "Note: Use OTP login in production!\n";
        echo "\n";
    }
}
