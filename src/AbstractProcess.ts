export enum ProcessStatus {
  none = 'none',
  ok = 'ok',
  error = 'error'
}

export abstract class AbstractProcess {
  #name: string
  #processStatus = {
    status: ProcessStatus.none,
  }

  constructor(name: string) {
    this.#name = name
  }

  get processStatus() {
    return {
      name: this.#name,
      status: this.#processStatus.status
    }
  }

  setProcessStatus(status: ProcessStatus) {
    this.#processStatus.status = status
  }

  setProcessStatusOk() {
    this.setProcessStatus(ProcessStatus.ok)
  }

  setProcessStatusError() {
    this.setProcessStatus(ProcessStatus.error)
  }

  setProcessStatusNone() {
    this.setProcessStatus(ProcessStatus.none)
  }

  wrapFunction<F extends () => any>(f: F): ReturnType<F> {
    try {
      return f()
    } catch (error) {
      this.setProcessStatusError()

      throw error
    }
  }
}