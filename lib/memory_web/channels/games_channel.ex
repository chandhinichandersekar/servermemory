
defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel


  alias Memory.Game, as: GameMemory

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      memory = Memory.GameBackup.load(name) || GameMemory.new()
      socket = socket
      |> assign(:name, name)
      |> assign(:gameMemory, memory)
      {:ok, %{"join" => name, "memory" => memory}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client

  def handle_in("guessMemory", %{"index" => index}, socket) do
    newState = GameMemory.guess(socket.assigns[:gameMemory], index)
    Memory.GameBackup.save(socket.assigns[:name], newState)
    socket = assign(socket, :gameMemory, newState)
    {:reply, {:ok, %{ "newState" => newState}}, socket}
  end

  def handle_in("hideGuesses", %{}, socket) do
    newState = GameMemory.hideGuesses(socket.assigns[:gameMemory])
    Memory.GameBackup.save(socket.assigns[:name], newState)
    socket = assign(socket, :gameMemory, newState)
    {:reply, {:ok, %{ "newState" => newState}}, socket}
  end

  def handle_in("resetGame", %{}, socket) do
    newState = GameMemory.new()
    Memory.GameBackup.save(socket.assigns[:name], newState)
    socket = assign(socket, :gameMemory, newState)
    {:reply, {:ok, %{ "newState" => newState}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
