defmodule Memory.Game do
  def new do
    getDefaultState
  end

  def getDefaultState do
    tiles = [createLetterObject("A"),
     createLetterObject("B"),
     createLetterObject("C"),
     createLetterObject("D"),
     createLetterObject("E"),
     createLetterObject("F"),
     createLetterObject("G"),
     createLetterObject("H"),
     createLetterObject("A"),
     createLetterObject("B"),
     createLetterObject("C"),
     createLetterObject("D"),
     createLetterObject("E"),
     createLetterObject("F"),
     createLetterObject("G"),
     createLetterObject("H")]
     tiles = Enum.shuffle(tiles)
    %{
      clicks: 5,
      firstGuess: nil,
      secondGuess: nil,
      tiles: tiles
    }
  end

  def guess(currentState, index) do
    Map.merge(currentState, %{
        clicks: currentState.clicks + 1
      })
  end

  def createLetterObject(letter) do
    %{
      letter: letter
    }
  end
end
