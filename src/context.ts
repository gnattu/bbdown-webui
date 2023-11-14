import { createContext } from 'react'
import { UIConfig } from './datatype'
import * as defaultConfig from './defaultconfig.json'
export const ConfigContext = createContext<UIConfig>(defaultConfig)
