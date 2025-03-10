import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  imdbRating: number;
} 

interface Api {
  Search: Movie[];
}
function App() {
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [minRating, setMinRating] = useState<number>(0);

  const { data, isLoading, error } = useQuery<Api>({
    queryKey: ["movies", search],
    queryFn: async () => {
      const { data } = await axios.get<Api>(
        `https://www.omdbapi.com/?s=${search}&apikey=d92470ab`
      );
      return data;
    },
    enabled: !!search,
  });

  // const sortedMovies = data?.Search?.filter(
  //   (movie) => movie.imdbRating >= minRating
  // )?.sort((a:string, b:string) =>
  //   sortOrder === "desc"
  //     ? b.imdbRating - a.imdbRating
  //     : a.imdbRating - b.imdbRating
  // );

  const changeRating = (e: ChangeEvent<HTMLSelectElement>) => {
    setMinRating(Number((e.target as HTMLSelectElement).value));
  };

  const sortOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder((e.target as HTMLSelectElement).value);
  };
  const submitHandel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch((e.target as HTMLFormElement).search.value);
  };

  return (
    <main className="flex flex-col max-w-6xl items-center mx-auto  pt-4">
      <span className="text-[#333]">Movie Search Engine</span>
      <div className="flex flex-col items-center gap-5 py-16 w-full">
        <h1 className="text-gray-900 text-3xl">Movie Search</h1>
        <p className="text-gray-600">
          Search for your favorite movies and rate them
        </p>
        <form
          className="w-full flex items-center"
          onSubmit={(e) => submitHandel(e)}
        >
          <input
            type="text"
            className="border-none py-4 px-8 focus:outline-none focus:border-none shadow-lg w-full outline-black"
            placeholder="Enter Movie title..."
            name="search"
          />
          <button
            type="submit"
            className="bg-[#e50914] cursor-pointer py-3.5 px-8 text-lg rounded-tr-md rounded-br-lg font-semibold"
          >
            Search
          </button>
        </form>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error.message}</p>}
        {data?.Search ? (
          <div className="flex flex-col gap-16 pt-12">
            <div className="flex items-center justify-between shadow-lg p-6">
              <div className="flex items-center gap-5">
                <label htmlFor="minRating">Minimum Rating:</label>
                <select
                  value={minRating}
                  id="minRating"
                  onChange={changeRating}
                  className="border border-solid px-2 py-2 rounded-lg focus:border-red-700 focus:border-[2px]"
                >
                  <option value="ALL Ratings">ALL Ratings</option>
                  <option value="5">5+</option>
                  <option value="6">6+</option>
                  <option value="7">7+</option>
                  <option value="8">8+</option>
                  <option value="9">9+</option>
                </select>
              </div>
              <div className="flex items-center gap-5">
                <label htmlFor="sort">Sort By Rating:</label>
                <select
                  value={sortOrder}
                  id="sort"
                  onChange={sortOrderChange}
                  className="border border-solid px-2 py-2 rounded-lg focus:border-red-700 focus:border-[2px]"
                >
                  <option value="ALL Ratings">Highest First</option>
                  <option value="5">Lower First</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <span>Search Results</span>
              <div className="grid grid-cols-4 gap-8">
                {data.Search.map((movie: any) => (
                  <div
                    key={movie.imdbID}
                    className="flex flex-col gap-5 shadow-lg"
                  >
                    {movie.Poster !== "N/A" ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="w-full h-[400px]"
                      />
                    ) : (
                      <span className="bg-[rgba(248, 248, 248, 1)] shadow-sm flex items-center justify-center text-lg w-full h-[400px]">
                        No Poster Available
                      </span>
                    )}
                    <div className="flex flex-col gap-5 px-4 py-2">
                      <h2 className="text-lg">{movie.Title}</h2>
                      <span>{movie.Year}</span>
                      <span>IMDb Rating: {movie.imdbID}</span>
                      <span>Your Rating: ★★★★★</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>No movies found. Try a different search term.</p>
        )}
      </div>
    </main>
  );
}

export default App;
