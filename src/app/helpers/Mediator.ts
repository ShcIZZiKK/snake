interface Channel {
  context: Mediator,
  callback: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Channels {
  [key: string]: Array<Channel>
}

class Mediator {
  private static instance: Mediator;
  private static channels: Channels = {};

  public static getInstance(): Mediator {
    if (!Mediator.instance) {
      Mediator.instance = new Mediator();
    }

    return Mediator.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(channel: string, fn: (args: any) => void) {
    if (!Mediator.channels[channel]) {
      Mediator.channels[channel] = [];
    }

    Mediator.channels[channel].push({
      context: this,
      callback: fn,
    });
  }

  unsubscribe(channel: string) {
    if (!Mediator.channels[channel]) {
      return false;
    }

    delete Mediator.channels[channel];

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publish(channel: string, ...props: any) {
    if (!Mediator.channels[channel]) {
      return false;
    }

    const args = Array.prototype.slice.call(props, 0);

    Mediator.channels[channel].forEach((subscription) => {
      subscription.callback.apply(subscription.context, args);
    });

    return this;
  }
}

export default Mediator;
