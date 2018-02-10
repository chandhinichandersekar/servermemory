defmodule Memory.Game do
  def new do
    getDefaultState()
  end

  def getDefaultState() do
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
     #tiles = Enum.shuffle(tiles)
    %{
      clicks: 0,
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
      tiles: secondGuessHidden,
      firstGuess: nil,
      secondGuess: nil
      })
  end

  def compareTiles(currentState) do
    firstGuess = Enum.at(currentState.tiles, currentState.firstGuess)
    secondGuess = Enum.at(currentState.tiles, currentState.secondGuess)
    firstGuess.letter === secondGuess.letter
  end

  def getTilesMatched(tiles, index) do
    IO.inspect index
    newTile = Enum.at(tiles, index)
    Map.merge(newTile, %{
        matched: true
      })
  end

  def matchTiles(currentState) do
    newTiles = currentState.tiles
    firstGuessMatched = getTilesMatched(newTiles, currentState.firstGuess)
    newTiles = List.replace_at(newTiles, currentState.firstGuess, firstGuessMatched)
    secondGuessMatched = getTilesMatched(newTiles, currentState.secondGuess)
    List.replace_at(newTiles, currentState.secondGuess, secondGuessMatched)
  end

  #def getNewStateFromWin(state) do
    #if state.matched === 16 do
    #  true
    #else
    #  false
    #end
  #end

  def guess(currentState, index) do
    if currentState.firstGuess === nil do
      newTiles = setTileShow(currentState.tiles, index, true)
      Map.merge(currentState, %{
          clicks: currentState.clicks + 1,
          firstGuess: index,
          tiles: newTiles,
          hide: false
        })
    else
      if currentState.secondGuess === nil do
        newTiles = setTileShow(currentState.tiles, index, true)
        newState = Map.merge(currentState, %{
            clicks: currentState.clicks + 1,
            secondGuess: index,
            tiles: newTiles,
          })
          if compareTiles(newState) do
            newTiles = matchTiles(newState)
            newState = Map.merge(newState, %{
                firstGuess: nil,
                secondGuess: nil,
                tiles: newTiles,
                #matched: newState.matched + 2
              })
            IO.inspect newState
            newState
            #Map.merge(newState, %{
                #win: getNewStateFromWin(newState)
              #})
          else
            Map.merge(newState, %{
              hide: true
            })
          end
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
