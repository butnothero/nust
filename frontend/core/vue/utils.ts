import type { ExtendedRouteRaw, ExtendedRouteNormalized } from '../types/vue';

export function addPagePropsGetterToRoutes(routes: ExtendedRouteRaw[]) {
  routes.forEach((staticRoute) => {
    const originalProps = staticRoute.props;

    staticRoute.props = (route: ExtendedRouteNormalized) => {
      const resolvedProps =
        // eslint-disable-next-line no-nested-ternary
        originalProps === true
          ? route.params
          : typeof originalProps === 'function'
          ? originalProps(route)
          : originalProps;

      return {
        ...(route.meta.hmr || {}).value, // Internal API to refresh page props
        ...(route.meta.state || {}),
        ...(resolvedProps || {}),
      };
    };
  });
}
