jQuery ->

  mappings = {
    'i': 'up',
    'k': 'down',
    'j': 'counterClockwise',
    'l': 'clockwise',
    'a': 'left',
    'd': 'right',
    's': 'back',
    'f': 'flip',
    'w': 'front',
    'g': 'land',
    't': 'takeoff'
  }

  for key of mappings
    ((key, mapping)->
      keypress.register_combo
        keys: key,
        prevent_repeat: true,
        on_keydown: ->
          console.log(key, 'down', mappings[key])
        on_keyup: ->
          console.log(key, 'up', mappings[key])
    )(key, mappings[key])