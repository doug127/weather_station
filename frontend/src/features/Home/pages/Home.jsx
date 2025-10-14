import { useContext } from 'react'
import { Context } from '@/shared/api/contextProvider'
import { RequireRole } from '@/shared/components/role/RequireRole'
import { AuthContext } from '@/shared/hooks/AuthContext'
import { NavigationMap } from '../utils/NavigationMap'

export const Home = () => {
    const {optionBanner} = useContext(Context);
    const { user } = useContext(AuthContext);

    const navigationValues = Object.entries(NavigationMap);

    return(
      <div className="p-6">
        {navigationValues.map(([key, e]) => {
          const Component = e.component;
          <RequireRole key={key} minRole={e.role_id} user={user}>
            {optionBanner === `${e.label}` && <Component />}
          </RequireRole>
        })}
      </div>
    )
}