import React from 'react'

const Submit = ({handleSubmit}) => {
    console.log("render")
  return (
    <button onClick={handleSubmit}>Submit</button>

  )
}

export default React.memo(Submit)