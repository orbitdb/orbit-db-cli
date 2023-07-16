import { FlagOutput } from '@oclif/core/lib/interfaces/parser'

const actionList = [
    "create",
    "add",
    "remove",
    // Là je vous laisserez me dire les autres actions
]

type ManagerInfos = {
    method: string,
    action: string,
    flags: FlagOutput | undefined
}

function manager(infos: ManagerInfos) {
    if (actionList.indexOf(infos.action) < 0) {
        console.error('(x) Not a valid action')
        return
    }
    console.log(infos.method, infos.action, infos.flags)
}

export { manager, ManagerInfos }