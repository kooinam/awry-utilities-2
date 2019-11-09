const renderActions = (actions) => {
  const components =  _.filter(actions, (action) => {
    return action.canAccess;
  }).map((action) => {
    return action.component;
  });

  return components;
}

export default renderActions;
