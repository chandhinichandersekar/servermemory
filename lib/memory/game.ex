defmodule Memory.Game do
  def new do
    %{
      clicks: 5,
      firstGuess: [],
      secondGuess: [],
      tiles: ["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"]
    }
  end
end
