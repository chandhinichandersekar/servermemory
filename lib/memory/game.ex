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

  def setTileShow(tiles, index, showValue)do
    newTile = Enum.at(tiles, index)
    newTile = Map.merge(newTile, %{
        show: showValue
      })
    List.replace_at(tiles, index, newTile)
  end

  def hideGuesses(currentState) do
    firstGuessHidden = setTileShow(currentState.tiles, currentState.firstGuess, false)
    secondGuessHidden = setTileShow(firstGuessHidden, currentState.secondGuess, false)
    Map.merge(currentState, %{
      tiles: secondGuessHidden
      })
  end

  def guess(currentState, index) do
    if currentState.firstGuess === nil do
    newTiles = setTileShow(currentState.tiles, index, true)
    Map.merge(currentState, %{
        clicks: currentState.clicks + 1,
        firstGuess: index,
        tiles: newTiles
      })
    else
      if currentState.secondGuess === nil do
      newTiles = setTileShow(currentState.tiles, index, true)
      Map.merge(currentState, %{
          clicks: currentState.clicks + 1,
          secondGuess: index,
          tiles: newTiles,
          hide: true
        })
      else
        currentState
    end
  end

  end

  def createLetterObject(letter) do
    %{
      letter: letter
    }
  end
end
