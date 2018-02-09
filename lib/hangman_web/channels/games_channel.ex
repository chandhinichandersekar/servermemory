defmodule HangmanWeb.GamesChannel do
  use HangmanWeb, :channel

  alias Hangman.Game
  alias Memory.Game, as: GameMemory

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new()
      memory = GameMemory.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      |> assign(:gameMemory, memory)
      {:ok, %{"join" => name, "game" => Game.client_view(game), "memory" => memory}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("guess", %{"letter" => ll}, socket) do
    game = Game.guess(socket.assigns[:game], ll)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  def handle_in("guessMemory", %{"index" => index}, socket) do
    newState = GameMemory.guess(socket.assigns[:gameMemory], index)
    socket = assign(socket, :gameMemory, newState)
    {:reply, {:ok, %{ "newState" => newState}}, socket}
  end

  def handle_in("hideGuesses", %{}, socket) do
    newState = GameMemory.hideGuesses(socket.assigns[:gameMemory])
    socket = assign(socket, :gameMemory, newState)
    {:reply, {:ok, %{ "newState" => newState}}, socket}
  end

  def handle_in("resetGame", %{}, socket) do
    newState = GameMemory.new()
    socket = assign(socket, :gameMemory, newState)
    {:reply, {:ok, %{ "newState" => newState}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
