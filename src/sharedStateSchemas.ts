import { z } from 'zod';

export const SshHostSchema = z.strictObject({
    user: z.string(),
    name: z.string(),
    ipOrDns: z.string(),
    port: z.number().optional(),
    privateKey: z.string(),
    knownHostsEntry: z.string(),
    jumpHost: z.string().optional()
});

export const BaseInfrastructureSchema = z.object({
    jumpHost: SshHostSchema.optional(),
    swarmManagers: z.array(SshHostSchema),
    domains: z.object({
        app: z.string(),
        infrastructure: z.string()
    })
});

export const InfrastructureServicesSchema = z.object({
    networkIds: z.object({
        externalAccess: z.string(),
        internal: z.string()
    }),
    containerRegistry: z.object({
        externalAddress: z.string(),
        internalAddress: z.string(),
        username: z.string(),
        password: z.string()
    }),
    traefikEndpoint: z.string()
});

export const MonitoringServicesSchema = z.object({
    networkIds: z.object({
        openTelemetryCollectors: z.string()
    })
});

export type MonitoringServicesSchema = z.infer<typeof MonitoringServicesSchema>
export type InfrastructureServicesSchema = z.infer<typeof InfrastructureServicesSchema>
export type BaseInfrastructureSchema = z.infer<typeof BaseInfrastructureSchema>
export type SshHostSchema = z.infer<typeof SshHostSchema>
