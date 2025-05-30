<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use Illuminate\Support\Facades\Storage as FacadesStorage;
use Illuminate\Support\Str;

class PostController extends Controller
{

    public function index()
    {
        try {
            if (
                !auth('admin')->check() &&
                !(auth('sanctum')->check() && auth('sanctum')->user()->is_admin)
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nincs jogosultság!',
                ], 401);
            }

            $posts = Post::with('category')
                ->orderBy('created_at', 'desc')
                ->get()
                ->each(function ($post) {
                    $post->append('author_name');
                });

            return response()->json([
                'success' => true,
                'posts' => $posts,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a bejegyzések lekérésekor.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $post = Post::with(['category'])->findOrFail($id);

            if ($post->status !== 'published') {
                $isAdmin = Auth::guard('admin')->check() ||
                    (Auth::guard('sanctum')->check() && Auth::guard('sanctum')->user()->is_admin);

                if (!$isAdmin) {
                    return response()->json([
                        'success' => false,
                        'message' => 'A bejegyzés nem megtekinthető!'
                    ], 403);
                }
            }

            if ($post->image_path) {
                $post->image_path = asset('storage/' . $post->image_path);
            }

            if ($post->diseases) {
                if (is_string($post->diseases)) {
                    $post->diseases = json_decode($post->diseases);
                }
            }

            $post->append('author_name');

            return response()->json([
                'success' => true,
                'post' => $post,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a bejegyzés betöltése során',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPublicPosts()
    {
        try {
            $posts = Post::with(['category'])
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->get()
                ->each(function ($post) {
                    $post->append('author_name');
                });

            return response()->json([
                'success' => true,
                'posts' => $posts,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a bejegyzések lekérésekor.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'category_id' => 'nullable|exists:categories,id',
                'status' => 'required|in:draft,published,archived',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'diseases' => 'nullable',
                'featured' => 'boolean'
            ]);

            $isAdmin = Auth::guard('admin')->check();
            $isUserAdmin = Auth::guard('sanctum')->check() && Auth::guard('sanctum')->user()->is_admin;

            if (!$isAdmin && !$isUserAdmin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nincs jogosultság a bejegyzés létrehozására!',
                ], 403);
            }

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('images', 'public');
                $validatedData['image_path'] = $imagePath;
            }

            $publishedAt = $validatedData['status'] === 'published' ? now() : null;

            $diseases = $request->input('diseases');

            if (is_string($diseases)) {
                $diseases = json_decode($diseases, true);
            }

            if ($isAdmin) {
                $authorId = Auth::guard('admin')->id();
                $authorType = 'admin';
            } else {
                $authorId = Auth::guard('sanctum')->user()->id;
                $authorType = 'user';
            }

            $post = Post::create([
                'title' => $validatedData['title'],
                'content' => $validatedData['content'],
                'author_id' => $authorId,
                'author_type' => $authorType,
                'slug' => Str::slug($validatedData['title']),
                'excerpt' => Str::limit($validatedData['content'], 100),
                'category_id' => $validatedData['category_id'] ?? null,
                'status' => $validatedData['status'] ?? 'draft',
                'image_path' => $validatedData['image_path'] ?? null,
                'published_at' => $publishedAt,
                'diseases' => $diseases,
                'featured' => $validatedData['featured'] ?? false
            ]);

            return response()->json([
                'success' => true,
                'message' => 'A poszt sikeresen létrejött!',
                'post' => $post,
                'diseases' => $post->diseases,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Érvénytelen adatok.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a poszt létrehozása során.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            if (
                !auth('admin')->check() &&
                !(auth('sanctum')->check() && auth('sanctum')->user()->is_admin)
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nincs jogosultság!',
                ], 401);
            }

            $post = Post::findOrFail($id);

            if ($request->has('diseases')) {
                $diseases = $request->input('diseases');
                if (is_string($diseases)) {
                    $validatedData['diseases'] = $diseases;
                }
            }

            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'category_id' => 'nullable|exists:categories,id',
                'status' => 'required|in:draft,published,archived',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'diseases' => 'nullable',
                'featured' => 'boolean'
            ]);

            $validatedData['excerpt'] = Str::limit($validatedData['content'], 100);

            if (isset($validatedData['image_path'])) {
                $post->update(['image_path' => $validatedData['image_path']]);
            }

            if ($request->hasFile('image')) {
                if ($post->image_path) {
                    FacadesStorage::disk('public')->delete($post->image_path);
                }

                $image = $request->file('image');
                $imagePath = $image->store('images', 'public');
                $validatedData['image_path'] = $imagePath;
            }

            if ($validatedData['status'] === 'published' && !$post->published_at) {
                $validatedData['published_at'] = now();
            }

            if ($request->has('featured')) {
                $validatedData['featured'] = (bool) $request->input('featured');
            }

            unset($validatedData['author_id']);
            unset($validatedData['author_type']);

            $post->update($validatedData);

            if (isset($validatedData['diseases'])) {
                $validatedData['diseases'] = json_encode($validatedData['diseases'] ?? []);
            }

            return response()->json([
                'success' => true,
                'message' => 'A bejegyzés sikeresen frissítve!',
                'post' => $post,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a bejegyzés frissítése során.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroy($id)
    {
        try {
            if (
                !auth('admin')->check() &&
                !(auth('sanctum')->check() && auth('sanctum')->user()->is_admin)
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nincs jogosultság!',
                ], 401);
            }

            $post = Post::findOrFail($id);

            if ($post->image_path) {
                FacadesStorage::disk('public')->delete($post->image_path);
            }

            $post->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'A bejegyzés sikeresen törölve!',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a bejegyzés törlése során.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function searchByDiseases(Request $request)
    {
        $searchTerms = $request->input('diseases', []);

        if (empty($searchTerms)) {
            return response()->json([
                'message' => 'Kérlek adj meg keresési feltételt',
                'posts' => []
            ]);
        }

        $posts = Post::where(function ($query) use ($searchTerms) {
            foreach ($searchTerms as $disease) {
                $query->orWhereRaw("JSON_SEARCH(JSON_UNQUOTE(diseases), 'one', ?) IS NOT NULL", [$disease]);
            }
        })
            ->where('status', 'published')
            ->with(['category', 'author'])
            ->get();

        return response()->json([
            'success' => true,
            'posts' => $posts,
            'total' => $posts->count()
        ]);
    }
    public function searchInContent(Request $request)
    {
        $query = $request->query('q');

        if (!$query) {
            return response()->json([
                'message' => 'Kérlek adj meg keresési feltételt!',
                'posts' => []
            ]);
        }

        $posts = Post::where('content', 'LIKE', '%' . $query . '%')
            ->orWhere('title', 'LIKE', '%' . $query . '%')
            ->where('status', 'published')
            ->with(['category', 'author'])
            ->select('id', 'title', 'excerpt', 'image_path', 'published_at', 'category_id', 'diseases')
            ->get();

        return response()->json([
            'message' => 'Keresés sikeres!',
            'posts' => $posts
        ]);
    }
    public function getFeaturedPosts()
    {
        try {
            $posts = Post::query()
                ->with(['author', 'category'])
                ->where('featured', '=', 1)
                ->where('status', '=', 'published')
                ->orderBy('created_at', 'desc')
                ->take(4)
                ->get();

            return response()->json([
                'success' => true,
                'posts' => $posts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function getLatestPosts()
    {
        try {
            $posts = Post::query()
                ->with(['author', 'category'])
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->take(6)
                ->get();

            return response()->json([
                'success' => true,
                'posts' => $posts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
